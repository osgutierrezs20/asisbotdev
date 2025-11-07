/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando productos existentes...');
  await prisma.product.deleteMany();

  const result = await prisma.product.createMany({
    data: [
      {
        name: 'Kitadol 500mg',
        description: 'Para el dolor de cabeza y fiebre.',
        active_principle: 'Paracetamol',
        category: 'Paracetamol',
        stock: 100,
        price: 1500,
      },
      {
        name: 'Tapsin 1g',
        description: 'Para el resfrío.',
        active_principle: 'Paracetamol',
        category: 'Paracetamol',
        stock: 50,
        price: 2000,
      },
      {
        name: 'Sal de Fruta ENO',
        description: 'Para la acidez estomacal.',
        active_principle: 'Bicarbonato de Sodio',
        category: 'Antiacido',
        stock: 0,
        price: 2500,
      },
      {
        name: 'Ibuprofeno 400mg',
        description: 'Antiinflamatorio.',
        active_principle: 'Ibuprofeno',
        category: 'Ibuprofeno',
        stock: 120,
        price: 1800,
      },
      {
        name: 'Aspirina 500mg',
        description: 'Analgesico y antipiretico.',
        active_principle: 'Acido Acetilsalicílico',
        category: 'Aspirina',
        stock: 30,
        price: 1400,
      },
    ],
  });

  console.log(`Productos insertados (count): ${result.count}`);
}

main()
  .then(() => {
    console.log('Seed completado correctamente.');
  })
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
