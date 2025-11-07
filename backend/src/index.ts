import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Mock endpoint para /api/chat (HU-04)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  console.log('Mensaje recibido:', message);
  return res.json({ response: 'Hola, soy Asisbot. Recibí tu mensaje.' });
});

// Health / root
app.get('/', (req: Request, res: Response) => {
  res.send('API funcionando');
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

