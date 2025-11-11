import { Router } from 'express';
import { 
  getAllCategories, 
  createCategory,
  updateCategory,
  deleteCategory 
} from '../controllers/category.controller';

const router = Router();

// GET /api/categories - Obtener todas las categorías
router.get('/categories', getAllCategories);

// POST /api/categories - Crear una nueva categoría
router.post('/categories', createCategory);

// PUT /api/categories/:id - Actualizar una categoría
router.put('/categories/:id', updateCategory);

// DELETE /api/categories/:id - Eliminar una categoría
router.delete('/categories/:id', deleteCategory);

export default router;
