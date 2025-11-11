import { useState, useEffect } from 'react';
import './ProductGrid.css';

// Interfaz basada en nuestro schema de BDD normalizado
interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  imageUrl: string | null; // Campo de imagen (opcional)
  category: { // Objeto anidado que traemos desde el backend
    id: number;
    name: string;
  };
}

const ProductGrid = () => {
  // Estado para guardar los productos
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Llamar al backend GET /api/products (incluye category)
        const res = await fetch('http://localhost:3001/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProducts();
  }, []); // Array vacío = solo se ejecuta una vez al montar

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {/* Imagen del producto */}
          <div className="product-image-container">
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/300x300.png?text=Sin+Imagen'} 
              alt={product.name} 
              className="product-image"
            />
            {/* Badge de stock */}
            {product.stock > 0 ? (
              <span className="stock-badge in-stock">Disponible</span>
            ) : (
              <span className="stock-badge out-of-stock">Agotado</span>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-info">
            <h4 className="product-name">{product.name}</h4>
            <p className="product-category">Categoría: {product.category.name}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-footer">
              <p className="product-price">${product.price.toLocaleString('es-CL')}</p>
              <button className="btn-add-to-cart" disabled={product.stock === 0}>
                {product.stock > 0 ? 'Añadir al carro' : 'Sin stock'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
