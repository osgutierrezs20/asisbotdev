import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mensaje de bienvenida con disclaimer legal (HU-10)
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now(),
      text: 'Bienvenido a Asisbot. Soy un asistente virtual y no reemplazo la opinión de un profesional de la salud.',
      sender: 'bot',
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el input no esté vacío
    if (!input.trim()) {
      return;
    }

    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    // Añadir mensaje del usuario al array
    setMessages((prev) => [...prev, userMessage]);

    // Guardar el mensaje antes de limpiar el input
    const messageText = input;

    // Limpiar el campo de input
    setInput('');

    // Activar loading (HU-13)
    setIsLoading(true);

    // Conexión con la API
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      // Crear mensaje del bot
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
      };

      // Añadir mensaje del bot al array
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      // Mensaje de error en el chat
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Error: No se pudo conectar con el servidor.',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Desactivar loading siempre (incluso si hay error)
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      {/* Lista de mensajes */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>

      {/* Indicador de loading (HU-13) */}
      {isLoading && (
        <div className="loading-indicator">Asisbot está escribiendo...</div>
      )}

      {/* Formulario de entrada */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Enviar
        </button>
      </form>
    </div>
  );
}
