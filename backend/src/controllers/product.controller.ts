import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products - Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true // Incluir información de la categoría
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      error: 'Error al obtener los productos'
    });
  }
};

// GET /api/products/:id - Obtener un producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      error: 'Error al obtener el producto'
    });
  }
};

// PUT /api/products/:id - Actualizar un producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Extraemos todos los campos del body
    const { name, description, stock, price, imageUrl, categoryId } = req.body;

    // Validamos que categoryId exista
    if (!categoryId) {
      return res.status(400).json({ error: 'El campo categoryId es requerido' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        stock: Number(stock),
        price: Number(price),
        imageUrl,
        categoryId: Number(categoryId) // Actualizamos la relación por ID
      },
      include: {
        category: true // Devolvemos el producto con la categoría anidada
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// POST /api/products - Crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Obtiene todos los datos del cuerpo
    const newProductData = req.body;
    const product = await prisma.product.create({
      data: newProductData,
    });
    res.status(201).json(product); // 201 = Creado
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// DELETE /api/products/:id - Borrar un producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id: productId },
    });
    res.status(204).send(); // 204 = Sin Contenido (Éxito)
  } catch (error: any) {
    console.error('Error al borrar producto:', error);
    
    // Si el producto no existe, Prisma lanza un error específico
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }
    
    res.status(500).json({ error: 'Error al borrar el producto' });
  }
};
