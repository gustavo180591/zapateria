import { Router } from 'express';
import { HelloController } from '../controllers/hello.controller';

const router = Router();
const helloController = new HelloController();

// Ruta GET /api/hello
router.get('/hello', helloController.getHello.bind(helloController));

export default router;
