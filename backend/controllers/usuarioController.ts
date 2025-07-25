import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { Rol } from '@prisma/client';

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        telefono: true,
        direccion: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

export const obtenerUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).usuario.id;
    const rol = (req as any).usuario.rol;

    // Solo el propio usuario o un admin pueden ver los datos
    if (id !== usuarioId && rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        telefono: true,
        direccion: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion, password, rol } = req.body;
    const usuarioId = (req as any).usuario.id;
    const usuarioRol = (req as any).usuario.rol;

    // Verificar si el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Solo el propio usuario o un admin pueden actualizar
    if (id !== usuarioId && usuarioRol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Solo un admin puede cambiar el rol
    if (rol && rol !== usuarioExistente.rol && usuarioRol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado para cambiar el rol' });
    }

    // Hashear la nueva contraseña si se proporciona
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        nombre,
        apellido,
        telefono,
        direccion,
        ...(hashedPassword && { password: hashedPassword }),
        ...(rol && { rol: rol as Rol })
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        telefono: true,
        direccion: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).usuario.id;
    const rol = (req as any).usuario.rol;

    // Verificar si el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Solo un admin puede eliminar usuarios
    if (rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Un admin no puede eliminarse a sí mismo
    if (id === usuarioId) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    await prisma.usuario.delete({ where: { id } });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
