import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/categories - Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      error: 'Error al obtener las categorías'
    });
  }
};

// POST /api/categories - Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const category = await prisma.category.create({
      data: { name }
    });
    
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    
    // Si la categoría ya existe (unique constraint)
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Ya existe una categoría con ese nombre'
      });
    }
    
    res.status(500).json({
      error: 'Error al crear la categoría'
    });
  }
};

// PUT /api/categories/:id - Actualizar una categoría
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;
    
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name }
    });
    
    res.json(updatedCategory);
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error);
    
    // Si la categoría no existe
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      });
    }
    
    // Si el nombre ya existe (unique constraint)
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Ya existe una categoría con ese nombre'
      });
    }
    
    res.status(500).json({
      error: 'Error al actualizar la categoría'
    });
  }
};

// DELETE /api/categories/:id - Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    // Verificar si hay productos usando esta categoría
    const productsCount = await prisma.product.count({
      where: { categoryId }
    });
    
    if (productsCount > 0) {
      return res.status(400).json({
        error: `No se puede eliminar la categoría porque hay ${productsCount} producto(s) asociado(s)`
      });
    }
    
    await prisma.category.delete({
      where: { id: categoryId }
    });
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      });
    }
    
    res.status(500).json({
      error: 'Error al eliminar la categoría'
    });
  }
};
