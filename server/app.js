import express from 'express';
import cors from 'cors';
import UsuarioRoutes  from './routes/usuario.routes.js';
import AdministradorRoutes from  './routes/administrador.routes.js';
import InstructorRoutes from './routes/instructor.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Usar las rutas de la aplicación
app.use(UsuarioRoutes);
app.use(AdministradorRoutes);
app.use(InstructorRoutes);

export default app;