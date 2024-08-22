import express from 'express';
import cors from 'cors';
import UsuarioRoutes  from './routes/usuario.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Usar las rutas de la aplicación
app.use(UsuarioRoutes);

export default app;