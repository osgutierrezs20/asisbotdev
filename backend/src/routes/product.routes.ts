import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  createProduct, 
  deleteProduct 
} from '../controllers/product.controller';

const router = Router();

// GET /api/products - Obtener todos los productos
router.get('/products', getAllProducts);

// GET /api/products/:id - Obtener un producto específico
router.get('/products/:id', getProductById);

// POST /api/products - Crear un nuevo producto
router.post('/products', createProduct);

// PUT /api/products/:id - Actualizar un producto
router.put('/products/:id', updateProduct);

// DELETE /api/products/:id - Borrar un producto
router.delete('/products/:id', deleteProduct);

export default router;
