/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista de productos con imágenes placeholder
const productsToCreate = [
  // --- Paracetamol (Categoría 1) ---
  { name: 'Kitadol 500mg (x10)', description: 'Analgésico y antipirético.', categoryId: 1, stock: 100, price: 1500, imageUrl: 'https://via.placeholder.com/300x300.png?text=Kitadol' },
  { name: 'Tapsin 1g (x8)', description: 'Para el resfrío y fiebre.', categoryId: 1, stock: 50, price: 2000, imageUrl: 'https://via.placeholder.com/300x300.png?text=Tapsin' },
  { name: 'Paracetamol 1g (x20)', description: 'Genérico.', categoryId: 1, stock: 75, price: 1800, imageUrl: 'https://via.placeholder.com/300x300.png?text=Paracetamol' },

  // --- Antiacido (Categoría 2) ---
  { name: 'Sal de Fruta ENO', description: 'Para la acidez estomacal.', categoryId: 2, stock: 0, price: 2500, imageUrl: 'https://via.placeholder.com/300x300.png?text=ENO' },
  { name: 'Gaviscon Comprimidos', description: 'Alivio rápido de la acidez.', categoryId: 2, stock: 30, price: 4500, imageUrl: 'https://via.placeholder.com/300x300.png?text=Gaviscon' },

  // --- Ibuprofeno (Categoría 3) ---
  { name: 'Ibuprofeno 400mg (x12)', description: 'Antiinflamatorio.', categoryId: 3, stock: 120, price: 1800, imageUrl: 'https://via.placeholder.com/300x300.png?text=Ibuprofeno' },
  { name: 'Nurofen Forte 400mg', description: 'Alivio del dolor.', categoryId: 3, stock: 40, price: 3200, imageUrl: 'https://via.placeholder.com/300x300.png?text=Nurofen' },

  // --- Farmacia (Categoría 4) ---
  { name: 'Algodón 100g', description: 'Material de curación.', categoryId: 4, stock: 200, price: 900, imageUrl: 'https://static.salcobrandonline.cl/spree/products/98153/large_webp/4102812.webp?1694117216' },
  { name: 'Pachitas (Parches curita x10)', description: 'Para heridas menores.', categoryId: 4, stock: 150, price: 500, imageUrl: 'https://via.placeholder.com/300x300.png?text=Pachitas' }
];

async function main() {
  console.log('Limpiando productos existentes...');
  await prisma.product.deleteMany();

  console.log('Insertando nuevos productos...');
  const result = await prisma.product.createMany({
    data: productsToCreate
  });

  console.log(`✅ ${result.count} productos insertados correctamente.`);
}

main()
  .then(() => {
    console.log('🎉 Seed completado correctamente.');
  })
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
