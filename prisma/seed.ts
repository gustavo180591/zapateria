import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  // Crear usuario administrador
  const hashedPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zapateria.com' },
    update: {},
    create: {
      email: 'admin@zapateria.com',
      name: 'Administrador',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  // Crear categorías de productos
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Zapatos' },
      update: {},
      create: { name: 'Zapatos', description: 'Calzado para todo tipo de ocasión' },
    }),
    prisma.category.upsert({
      where: { name: 'Zapatillas' },
      update: {},
      create: { name: 'Zapatillas', description: 'Calzado deportivo y casual' },
    }),
    prisma.category.upsert({
      where: { name: 'Botas' },
      update: {},
      create: { name: 'Botas', description: 'Calzado de invierno y trabajo' },
    }),
  ]);

  console.log('Seed completado con éxito!');
  console.log({ adminUser, categories });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
