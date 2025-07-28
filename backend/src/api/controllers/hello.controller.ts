import { Request, Response } from 'express';

/**
 * Controlador de prueba para validar conexión API–UI
 */
export class HelloController {
  public getHello(req: Request, res: Response): void {
    res.json({ message: '¡Hola desde el backend de Zapateria!' });
  }
}
