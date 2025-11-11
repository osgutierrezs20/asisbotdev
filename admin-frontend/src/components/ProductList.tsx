import { useState, useEffect } from 'react';
import EditProductModal from './EditProductModal';

// Interfaz para la categoría
interface Category {
  id: number;
  name: string;
}

// Interfaz para tipar los productos
interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  category: Category;
  stock: number;
  price: number;
  imageUrl?: string; // URL de la imagen (opcional)
}

interface Props {
  refreshTrigger?: number;
}

const ProductList = ({ refreshTrigger }: Props) => {
  // Estado para guardar los productos
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estado para manejar qué producto estamos editando
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Función para cargar productos
  const fetchProducts = async () => {
    try {
      // Llamar al endpoint GET del backend
      const res = await fetch('http://localhost:3001/api/products');
      const data = await res.json();
      
      // Guardar los productos en el estado
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Cargar productos cuando el componente se monte o cuando cambie refreshTrigger
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]); // Se ejecuta al montar y cuando refreshTrigger cambia

  // Función para guardar los cambios del producto
  const handleSaveProduct = async (updatedData: any) => {
    if (!editingProduct) return;

    try {
      // Llamar al endpoint PUT del backend con TODOS los campos
      const res = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        // El backend devuelve el producto actualizado con la categoría anidada
        const data = await res.json();
        
        // Actualizar la lista de productos localmente reemplazando el producto antiguo
        setProducts(products.map(p => (p.id === data.id ? data : p)));
        
        // Cerrar el modal
        setEditingProduct(null);
        
        console.log('Producto actualizado exitosamente');
      } else {
        console.error('Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  // Función para borrar un producto
  const handleDeleteProduct = async (productId: number) => {
    // Pedir confirmación
    if (!window.confirm('¿Estás seguro de que quieres borrar este producto?')) {
      return;
    }

    try {
      // Llamar al endpoint DELETE del backend
      const res = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Actualizar la UI filtrando el producto borrado
        setProducts(products.filter(p => p.id !== productId));
        console.log('Producto eliminado exitosamente');
      } else {
        console.error('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al borrar producto:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    Sin imagen
                  </div>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category.name}</td>
              <td>{product.stock}</td>
              <td>${product.price.toFixed(0)}</td>
              <td>
                <button onClick={() => setEditingProduct(product)}>
                  Editar
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{ marginLeft: '10px', backgroundColor: '#f44336' }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      <EditProductModal
        product={editingProduct}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductList;
