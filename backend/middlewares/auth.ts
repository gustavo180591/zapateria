import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        email: string;
        rol: string;
      };
    }
  }
}

export const auth = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Obtener el token del header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
      }

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
      
      // Buscar el usuario en la base de datos
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          rol: true
        }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si el usuario tiene el rol requerido
      if (roles.length > 0 && !roles.includes(usuario.rol)) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción' 
        });
      }

      // Agregar el usuario al request
      req.usuario = usuario;
      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
};
