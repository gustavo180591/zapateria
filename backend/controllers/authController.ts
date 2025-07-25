import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../../src/prisma';
import { Rol } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
  ? parseInt(process.env.JWT_EXPIRES_IN, 10)
  : 7 * 24 * 60 * 60; // 7 días en segundos

interface RegisterInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol?: Rol;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion, rol }: RegisterInput = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        password: hashedPassword,
        telefono,
        direccion,
        rol: rol || Rol.CLIENTE, // Por defecto es CLIENTE si no se especifica
      },
    });

    // Generar token JWT
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET, options);

    // No enviar la contraseña en la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET, options);

    // No enviar la contraseña en la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { usuario: { id: string } }).usuario.id;

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        telefono: true,
        direccion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};
