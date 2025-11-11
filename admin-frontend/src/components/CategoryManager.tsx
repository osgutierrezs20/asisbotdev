import { useState, useEffect } from 'react';
import './CategoryManager.css';

interface Category {
  id: number;
  name: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

  // Cargar categorías
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();
      
      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Crear nueva categoría
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        console.log('Categoría creada exitosamente');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al crear categoría');
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear categoría');
    }
  };

  // Iniciar edición
  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName }),
      });

      if (res.ok) {
        const updatedCategory = await res.json();
        setCategories(categories.map(c => 
          c.id === updatedCategory.id ? updatedCategory : c
        ));
        setEditingCategory(null);
        setEditName('');
        console.log('Categoría actualizada exitosamente');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al actualizar categoría');
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      alert('Error al actualizar categoría');
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  // Eliminar categoría
  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== categoryId));
        console.log('Categoría eliminada exitosamente');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar categoría');
    }
  };

  return (
    <div className="category-manager">
      <h2>Gestión de Categorías</h2>

      {/* Formulario para crear nueva categoría */}
      <form onSubmit={handleCreate} className="category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nueva categoría..."
          required
        />
        <button type="submit" className="btn-add-category">
          Añadir Categoría
        </button>
      </form>

      {/* Lista de categorías */}
      <div className="category-list">
        {categories.length === 0 ? (
          <p className="no-categories">No hay categorías registradas</p>
        ) : (
          <ul>
            {categories.map(category => (
              <li key={category.id} className="category-item">
                {editingCategory?.id === category.id ? (
                  // Modo edición
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                    />
                    <button onClick={handleSaveEdit} className="btn-save-small">
                      Guardar
                    </button>
                    <button onClick={handleCancelEdit} className="btn-cancel-small">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  // Modo vista
                  <div className="view-mode">
                    <span className="category-name">{category.name}</span>
                    <div className="category-actions">
                      <button 
                        onClick={() => handleStartEdit(category)}
                        className="btn-edit-small"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="btn-delete-small"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
