import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import CategoryManager from './components/CategoryManager';

function App() {
  // Estado para forzar la recarga de productos
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función que se llama cuando se agrega un producto
  const handleProductAdded = (newProduct: any) => {
    console.log('Producto agregado:', newProduct);
    // Incrementar el trigger para recargar la lista
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <h1>Panel de Farmacia - Asisbot</h1>
      
      {/* Gestión de categorías */}
      <CategoryManager />
      
      {/* Formulario para agregar productos */}
      <AddProductForm onProductAdded={handleProductAdded} />
      
      {/* Lista de productos */}
      <ProductList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
