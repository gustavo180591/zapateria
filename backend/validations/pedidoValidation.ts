import { z } from 'zod';

export const pedidoSchema = z.object({
  clienteId: z.string().uuid(),
  productos: z.array(
    z.object({
      productoId: z.string().uuid(),
      cantidad: z.number().int().positive(),
      precioUnitario: z.number().positive(),
      nombre: z.string(),
      descripcion: z.string().optional()
    })
  ),
  total: z.number().positive(),
  senia: z.number().min(0).optional(),
  fechaEntrega: z.string().datetime().optional(),
  notas: z.string().optional()
});

export const actualizarEstadoSchema = z.object({
  estado: z.enum(['RECIBIDO', 'EN_PROCESO', 'LISTO_PARA_ENTREGA', 'ENTREGADO', 'CANCELADO'])
});

export type PedidoInput = z.infer<typeof pedidoSchema>;
export type ActualizarEstadoInput = z.infer<typeof actualizarEstadoSchema>;
