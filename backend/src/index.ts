import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoutes from './routes/chat.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', chatRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

// Health / root
app.get('/', (req: Request, res: Response) => {
  res.send('API funcionando');
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
