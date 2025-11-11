import { useState, useEffect, FC } from 'react';
import './AddProductForm.css';

interface Category {
  id: number;
  name: string;
}

interface Props {
  onProductAdded: (newProduct: any) => void;
}

const AddProductForm: FC<Props> = ({ onProductAdded }) => {
  // Estados para todos los campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  
  // Estado para las categorías disponibles
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handler para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear objeto con los datos del nuevo producto
    const newProductData = {
      name,
      description,
      categoryId: parseInt(categoryId),
      stock: Number(stock),
      price: Number(price),
      imageUrl: imageUrl || undefined, // Solo incluir si hay valor
    };

    try {
      // Llamar al endpoint POST del backend
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Notificar al componente padre que se agregó un producto
        onProductAdded(data);
        
        // Limpiar los campos del formulario
        setName('');
        setDescription('');
        setCategoryId('');
        setStock(0);
        setPrice(0);
        setImageUrl('');
        
        console.log('Producto creado exitosamente');
      } else {
        console.error('Error al crear producto');
      }
    } catch (error) {
      console.error('Error al añadir producto:', error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Añadir Nuevo Producto</h2>
      
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Kitadol 500mg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Descripción del producto"
            rows={3}
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
                  width: '100px', 
                  height: '100px', 
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

        <div className="form-row">
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
        </div>

        <button type="submit" className="btn-add">
          Añadir Producto
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
