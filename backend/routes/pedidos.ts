import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { pedidoSchema, actualizarEstadoSchema } from '../validations/pedidoValidation';
import * as pedidoController from '../controllers/pedidoController';
import { auth } from '../middlewares/auth';

const router = Router();

// Rutas de pedidos
router.get('/', auth(['ADMIN', 'VENDEDOR']), pedidoController.listarPedidos);
router.post('/', auth(['CLIENTE', 'ADMIN', 'VENDEDOR']), validate(pedidoSchema), pedidoController.crearPedido);
router.get('/:id', auth(), pedidoController.obtenerPedido);
router.put('/:id', auth(), validate(pedidoSchema), pedidoController.actualizarPedido);
router.delete('/:id', auth(['ADMIN']), pedidoController.eliminarPedido);
router.put('/:id/estado', auth(['ADMIN', 'VENDEDOR', 'TALLER']), validate(actualizarEstadoSchema), pedidoController.actualizarEstadoPedido);

export default router;
