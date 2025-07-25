import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { 
  listarUsuarios, 
  obtenerUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../controllers/usuarioController';
import { auth } from '../middlewares/auth';

const router = Router();

// Rutas de usuarios
router.get('/', auth(['ADMIN']), listarUsuarios);
router.get('/:id', auth(), obtenerUsuario);
router.put('/:id', auth(), actualizarUsuario);
router.delete('/:id', auth(['ADMIN']), eliminarUsuario);

export default router;
