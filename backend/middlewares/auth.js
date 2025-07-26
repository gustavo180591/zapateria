import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from './errorHandler.js';

const prisma = new PrismaClient();

// Middleware para verificar el token JWT
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Obtener el token del encabezado de autorización
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'No estás autorizado para acceder a esta ruta');
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Obtener usuario del token
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          rol: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Adjuntar usuario al objeto de solicitud
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, 'Token inválido o expirado');
    }
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar roles de usuario
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return next(
        new ApiError(
          403,
          `Rol '${req.user.rol}' no tiene permiso para realizar esta acción`
        )
      );
    }
    next();
  };
};
