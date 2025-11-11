import React, { useState } from 'react';
import './App.css';
import ProductGrid from './components/ProductGrid';
import ChatWindow from './components/ChatWindow';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <h1 className="brand-name">Farmacia Asisbot</h1>
            <p className="brand-tagline">Tu salud, nuestra prioridad</p>
          </div>
          
          <div className="header-actions">
            <button className="btn-icon">
              <span>🔍</span>
            </button>
            <button className="btn-icon">
              <span>👤</span>
            </button>
            <button className="btn-icon cart">
              <span>🛒</span>
              <span className="cart-badge">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-title">
          <h2>Medicamentos</h2>
          <p className="results-count">Mostrando todos los productos disponibles</p>
        </div>
        
        <ProductGrid />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2025 Farmacia Asisbot - Todos los derechos reservados</p>
      </footer>

      {/* Widget de Chat Flotante (Asisbot) */}
      <button 
        className="chat-toggle-button" 
        onClick={toggleChat}
        aria-label="Abrir chat de Asisbot"
      >
        💬
      </button>

      {/* Ventana del Chat */}
      {isChatOpen && (
        <div className="chat-widget-container">
          <ChatWindow />
        </div>
      )}
    </div>
  );
}

export default App;
