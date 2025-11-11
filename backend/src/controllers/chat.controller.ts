import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

// Instanciar clientes
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handleChat = async (req: Request, res: Response) => {
  const { message } = req.body;
  console.log('Mensaje recibido:', message);

  try {
    // --- PASO 1: IA "EXTRACTOR DE TÉRMINOS" ---
    // Tarea simple: solo extraer términos de búsqueda.
    const promptExtractor = `
      Tu tarea es analizar la consulta de un usuario de farmacia.
      Extrae los *principios activos* o *nombres de productos* clave.
      Responde *solo* con un objeto JSON.
      El JSON debe tener una clave "terms" que sea un array de strings.
      Si no entiendes la consulta, responde {"terms": []}.

      EJEMPLOS DE EXTRACCIÓN:
      - Consulta: "dolor de cabeza y fiebre"
        Respuesta: {"terms": ["Paracetamol", "Ibuprofeno", "Analgésico"]}
      - Consulta: "resfriado fuerte con tos"
        Respuesta: {"terms": ["Antigripal", "Descongestionante", "Clorfenamina", "Paracetamol", "Jarabe para la tos"]}
      - Consulta: "necesito leche para mi bebe"
        Respuesta: {"terms": ["Leche de fórmula", "Fórmula infantil", "Leche", "Bebe"]}
      - Consulta: "voy a tener sexo, necesito condones"
        Respuesta: {"terms": ["Condones", "Preservativos", "Bienestar Sexual"]}
      - Consulta: "me corté, necesito algodón o parches"
        Respuesta: {"terms": ["Algodón", "Curitas", "Parches", "Gasa", "Primeros Auxilios"]}
      - Consulta: "shampoo o crema de manos"
        Respuesta: {"terms": ["Shampoo", "Crema", "Acondicionador", "Cuidado Personal"]}
      - Consulta: "hola"
        Respuesta: {"terms": []}
    `;

    const iaPaso1 = await openai.chat.completions.create({
      model: "gpt-4-turbo", // GPT-4 es mejor para seguir instrucciones de JSON
      messages: [
        { role: "system", content: promptExtractor },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.0
    });

    let searchTerms: string[] = [];
    try {
      const jsonResponse = JSON.parse(iaPaso1.choices[0].message.content || '{}');
      searchTerms = jsonResponse.terms || [];
      console.log('� Términos de búsqueda extraídos:', searchTerms);
    } catch (e) {
      console.error("Error al parsear JSON de IA (Paso 1):", e);
      throw new Error("Error de IA en Paso 1 (Parseo JSON)");
    }

    if (searchTerms.length === 0) {
      // La IA no entendió o no es un síntoma (ej. "hola")
      const botResponse = "Lo siento, no pude identificar un síntoma o producto en tu consulta. ¿Podrías ser más específico?";
      await prisma.conversation.create({ data: { userMessage: message, botResponse } });
      return res.json({ response: botResponse });
    }

    // --- PASO 2: EL "PESCADOR" (Prisma) ---
    // Busca CUALQUIER producto que coincida con los términos.
    // Esta es nuestra "red de pesca".
    console.log('🎣 Pescando productos con términos:', searchTerms);
    
    // Construimos un OR dinámico para cada término de búsqueda
    const orConditions = searchTerms.flatMap(term => [
      { name: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
      { category: { name: { contains: term, mode: 'insensitive' as const } } }
    ]);
    
    const candidateProducts = await prisma.product.findMany({
      where: {
        stock: { gt: 0 }, // ¡Solo con stock!
        OR: orConditions
      },
      // Traemos los datos que el "Farmacéutico" (IA Paso 3) necesita
      select: {
        name: true,
        description: true,
        price: true,
        category: { // ¡Importante! Traemos la categoría real del producto
          select: {
            name: true
          }
        }
      }
    });

    console.log(`✅ Productos candidatos encontrados: ${candidateProducts.length}`);

    // --- PASO 3: LA IA "FARMACÉUTICO EXPERTO" (Validar y Generar) ---
    // Aquí es donde ocurre la verdadera "magia".
    let botResponse = "";

    if (candidateProducts.length === 0) {
      // Caso 2: Sin Stock 
      botResponse = `Entendido. Para tu consulta sobre "${message}", parece que no tenemos productos relevantes en stock en este momento.`;
    
    } else {
      // Caso 1: ¡Éxito! Encontramos candidatos.
      const productDataForIA = JSON.stringify(candidateProducts);

      const promptFarmaceutico = `
      Eres Asisbot, un asistente farmacéutico experto y amable.
      TAREA: Ayudar a un usuario que tiene esta CONSULTA: "${message}".
      
      PRODUCTOS CANDIDATOS (Encontrados en mi inventario, con stock):
      ${productDataForIA}
      
      INSTRUCCIONES:
      1.  **Analiza la CONSULTA y la LISTA:** Mira la consulta del usuario. Ahora mira la lista de productos candidatos que te di.
      2.  **FILTRA Y VALIDA:** ¿Qué productos de la lista son *realmente relevantes* para la consulta? 
          -   **Ejemplo 1:** Si la consulta es "resfriado" y la lista contiene "Tapsin (Medicamentos)" y "Algodón (Primeros Auxilios)", DEBES IGNORAR "Algodón".
          -   **Ejemplo 2:** Si la consulta es "leche para bebe" y la lista contiene "Leche Nido (Bebes)", DEBES RECOMENDARLO.
      3.  **Genera una Recomendación:** Escribe una respuesta natural.
          -   **Si (después de filtrar) hay productos relevantes:** Confirma la consulta y recomienda 1 o 2 productos. Justifica tu recomendación (ej: "Para el resfriado, te recomiendo Tapsin..."). Menciona el precio si lo ves útil.
          -   **Si (después de filtrar) NINGÚN producto es relevante (ej. solo encontraste 'Algodón' para 'resfriado'):** Responde que no se encontraron productos *adecuados* para esa consulta.
      4.  **REGLAS:** Sé breve (2-3 frases). NO des consejos médicos.
      `;

      const iaPaso3 = await openai.chat.completions.create({
        model: "gpt-4-turbo", // GPT-4 es mucho mejor para comparar
        messages: [
          { role: "system", content: promptFarmaceutico }
        ],
        temperature: 0.5
      });
      
      botResponse = iaPaso3.choices[0].message.content || "Error al generar respuesta.";
      console.log('💬 Respuesta generada por IA Farmacéutico');
    }

    // --- Guardar y Enviar ---
    await prisma.conversation.create({ data: { userMessage: message, botResponse } });
    res.json({ response: botResponse });

  } catch (error) {
    // Manejo de errores (RNF-003)
    console.error("Error en /api/chat:", error);
    res.status(500).json({ response: "Lo siento, estoy teniendo problemas técnicos. Por favor, intenta más tarde." });
  }
};
