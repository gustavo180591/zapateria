import { PrismaClient, Rol } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario administrador
  const hashedPassword = await hash('admin123', 10);

  // Crear usuario administrador
  await prisma.usuario.upsert({
    where: { email: 'admin@zapateria.com' },
    update: {},
    create: {
      email: 'admin@zapateria.com',
      nombre: 'Administrador',
      apellido: 'Sistema',
      password: hashedPassword,
      rol: Rol.ADMIN,
      telefono: '+541112345678',
      direccion: 'Calle Falsa 123',
    },
  });

  // Crear usuario de prueba
  const testUser = await prisma.usuario.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      nombre: 'Cliente',
      apellido: 'Ejemplo',
      password: await hash('cliente123', 10),
      rol: Rol.CLIENTE,
      telefono: '+541198765432',
      direccion: 'Avenida Siempreviva 742',
    },
  });

  // Crear un pedido de ejemplo
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: testUser.id,
      productos: [
        { id: '1', nombre: 'Zapato de cuero', cantidad: 1, precio: 25000 },
        { id: '2', nombre: 'Cordon de repuesto', cantidad: 2, precio: 1500 },
      ],
      estado: 'RECIBIDO',
      total: 28000,
      senia: 5000,
      fechaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
      notas: 'Entregar con caja de regalo',
    },
  });

  console.log('\n=== Datos de prueba creados con éxito ===');
  console.log('\n🔑 Credenciales de administrador:');
  console.log('Email: admin@zapateria.com');
  console.log('Contraseña: admin123');

  console.log('\n👤 Credenciales de cliente:');
  console.log('Email: cliente@ejemplo.com');
  console.log('Contraseña: cliente123');

  console.log('\n📦 Pedido de ejemplo creado con ID:', pedido.id);

  // Mostrar información útil para desarrollo
  console.log('\n🔗 URLs útiles:');
  console.log(`- API: http://localhost:${process.env.PORT || 3000}`);
  console.log('- Prisma Studio: npx prisma studio');
  console.log('\n¡Listo para comenzar! 🚀');
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
