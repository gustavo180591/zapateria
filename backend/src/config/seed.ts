import { createConnection } from 'typeorm';
import { User, UserRole } from '../entities/User';
import * as bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    // Create database connection
    const connection = await createConnection();
    console.log('Connected to database');

    // Clear existing data
    await connection.dropDatabase();
    await connection.synchronize();
    console.log('Database synchronized');

    // Create admin user
    const admin = new User();
    admin.email = 'admin@example.com';
    admin.password = await bcrypt.hash('admin123', 10);
    admin.firstName = 'Admin';
    admin.lastName = 'User';
    admin.role = UserRole.ADMIN;
    admin.isActive = true;
    await admin.save();

    // Create test customer
    const customer = new User();
    customer.email = 'customer@example.com';
    customer.password = await bcrypt.hash('customer123', 10);
    customer.firstName = 'John';
    customer.lastName = 'Doe';
    customer.role = UserRole.CUSTOMER;
    customer.isActive = true;
    await customer.save();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
