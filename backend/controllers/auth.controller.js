import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler.js';

const prisma = new PrismaClient();

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Registrar nuevo usuario
export const register = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, telefono, direccion } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ApiError(400, 'El correo electrónico ya está en uso');
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono: telefono || null,
        direccion: direccion || null,
        rol: 'CLIENTE' // Rol por defecto
      }
    });

    // Generar token
    const token = generateToken(user.id);

    // Omitir la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    // Generar token
    const token = generateToken(user.id);

    // Omitir la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario actual
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        direccion: true,
        rol: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
