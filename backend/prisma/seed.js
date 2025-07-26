import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Borrar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.pedido.deleteMany();
  await prisma.usuario.deleteMany();

  // Crear roles
  console.log('👥 Creando usuarios de prueba...');
  
  // Crear administrador
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@zapateria.com',
      nombre: 'Admin',
      apellido: 'Sistema',
      password: hashedAdminPassword,
      rol: 'ADMIN',
      telefono: '1234567890',
      direccion: 'Calle Principal 123'
    }
  });

  // Crear vendedor
  const hashedVendedorPassword = await bcrypt.hash('vendedor123', 10);
  const vendedor = await prisma.usuario.create({
    data: {
      email: 'vendedor@zapateria.com',
      nombre: 'Juan',
      apellido: 'Vendedor',
      password: hashedVendedorPassword,
      rol: 'VENDEDOR',
      telefono: '0987654321',
      direccion: 'Avenida Central 456'
    }
  });

  // Crear cliente
  const hashedClientePassword = await bcrypt.hash('cliente123', 10);
  const cliente = await prisma.usuario.create({
    data: {
      email: 'cliente@ejemplo.com',
      nombre: 'María',
      apellido: 'González',
      password: hashedClientePassword,
      rol: 'CLIENTE',
      telefono: '5551234567',
      direccion: 'Calle Falsa 123'
    }
  });

  // Crear pedido de ejemplo
  console.log('📦 Creando pedidos de prueba...');
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: cliente.id,
      productos: [
        {
          id: 'prod-1',
          nombre: 'Zapatos de vestir',
          cantidad: 1,
          precioUnitario: 25000,
          talla: 42,
          color: 'negro',
          personalizaciones: {
            tipoSuela: 'goma',
            colorHebillas: 'plateado',
            detallesEspeciales: 'Iniciales M.G. en la suela'
          }
        }
      ],
      estado: 'RECIBIDO',
      total: 25000,
      senia: 5000,
      fechaEntrega: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días a partir de ahora
      notas: 'Entregar en horario de oficina'
    }
  });

  console.log('✅ Seed completado con éxito!');
  console.log('\n🔑 Credenciales de prueba:');
  console.log('----------------------------');
  console.log('👑 Admin:');
  console.log('  Email: admin@zapateria.com');
  console.log('  Contraseña: admin123');
  console.log('\n👔 Vendedor:');
  console.log('  Email: vendedor@zapateria.com');
  console.log('  Contraseña: vendedor123');
  console.log('\n👤 Cliente:');
  console.log('  Email: cliente@ejemplo.com');
  console.log('  Contraseña: cliente123');
  console.log('\n🔗 URL de Prisma Studio:');
  console.log('  npx prisma studio');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
