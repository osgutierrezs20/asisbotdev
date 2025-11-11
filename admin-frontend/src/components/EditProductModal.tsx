import { useState, useEffect, FC } from 'react';
import './EditProductModal.css';

// Interfaz para la categoría
interface Category {
  id: number;
  name: string;
}

// Interfaz para el producto
interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  category: Category;
  stock: number;
  price: number;
  imageUrl?: string;
}

// Props que recibe el componente
interface Props {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedData: { 
    name: string; 
    description: string; 
    stock: number; 
    price: number; 
    imageUrl: string | null;
    categoryId: number;
  }) => void;
}

const EditProductModal: FC<Props> = ({ product, onClose, onSave }) => {
  // Estados internos para TODOS los campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  // Estado para la lista de categorías
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar las categorías UNA VEZ al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías", err);
      }
    };
    fetchCategories();
  }, []);

  // Rellenar el formulario cuando el producto cambie
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setStock(product.stock);
      setPrice(product.price);
      setImageUrl(product.imageUrl || '');
      setCategoryId(product.categoryId);
    }
  }, [product]);

  // Handler para enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que categoryId esté seleccionado
    if (!categoryId) {
      alert('Por favor, seleccione una categoría');
      return;
    }
    
    onSave({ 
      name,
      description,
      stock: Number(stock), 
      price: Number(price), 
      imageUrl: imageUrl || null,  // Enviar null si está vacío
      categoryId: Number(categoryId)
    });
  };

  // Si no hay producto, no mostrar el modal
  if (!product) {
    return null;
  }

  return (
    // Overlay/fondo del modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Contenido del modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Producto: {product.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripción del producto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría:</label>
            <select 
              id="category"
              value={categoryId || ''} 
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock:</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.valueAsNumber)}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL de Imagen (opcional):</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.png"
            />
            {imageUrl && (
              <div style={{ marginTop: '10px' }}>
                <small>Vista previa:</small>
                <br />
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginTop: '5px'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-save">
              Guardar Cambios
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
