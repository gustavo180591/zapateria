import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { PedidoInput, ActualizarEstadoInput } from '../validations/pedidoValidation';

export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const { estado, clienteId } = req.query;
    
    const pedidos = await prisma.pedido.findMany({
      where: {
        ...(estado && { estado: estado as any }),
        ...(clienteId && { clienteId: clienteId as string })
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({ error: 'Error al listar pedidos' });
  }
};

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const data: PedidoInput = req.body;
    const usuarioId = (req as any).usuario.id;

    const pedido = await prisma.pedido.create({
      data: {
        ...data,
        clienteId: data.clienteId || usuarioId, // Si no se especifica, usa el ID del usuario autenticado
        productos: data.productos as any,
        usuarioId // Registra quién creó el pedido
      }
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

export const obtenerPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).usuario.id;
    const rol = (req as any).usuario.rol;

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Solo el cliente, admin o vendedor pueden ver el pedido
    if (pedido.clienteId !== usuarioId && !['ADMIN', 'VENDEDOR'].includes(rol)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

export const actualizarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: PedidoInput = req.body;
    const usuarioId = (req as any).usuario.id;
    const rol = (req as any).usuario.rol;

    // Verificar si el pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({ where: { id } });
    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Solo el cliente dueño o un admin pueden actualizar
    if (pedidoExistente.clienteId !== usuarioId && rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: {
        ...data,
        productos: data.productos as any
      }
    });

    res.json(pedido);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({ where: { id } });
    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    await prisma.pedido.delete({ where: { id } });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
};

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado }: ActualizarEstadoInput = req.body;
    const rol = (req as any).usuario.rol;

    // Verificar si el pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({ where: { id } });
    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Validar transiciones de estado según el rol
    if (rol === 'TALLER' && !['EN_PROCESO', 'LISTO_PARA_ENTREGA'].includes(estado)) {
      return res.status(403).json({ 
        error: 'Solo puedes cambiar el estado a EN_PROCESO o LISTO_PARA_ENTREGA' 
      });
    }

    if (rol === 'VENDEDOR' && estado === 'CANCELADO' && pedidoExistente.estado === 'ENTREGADO') {
      return res.status(403).json({ 
        error: 'No se puede cancelar un pedido ya entregado' 
      });
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado }
    });

    res.json(pedido);
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};
