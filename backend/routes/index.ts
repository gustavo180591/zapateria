import { Router } from 'express';
import authRoutes from './auth';
import pedidosRoutes from './pedidos';
import usuariosRoutes from './usuarios';

const router = Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de pedidos
router.use('/pedidos', pedidosRoutes);

// Rutas de usuarios
router.use('/usuarios', usuariosRoutes);

export default router;
