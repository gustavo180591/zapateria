import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../entities/User';
import path from 'path';

export const createDatabaseConnection = async () => {
  const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'zapateria',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    entities: [
      path.join(__dirname, '../entities/*.{js,ts}'),
    ],
    migrations: [
      path.join(__dirname, '../migrations/*.{js,ts}'),
    ],
    subscribers: [
      path.join(__dirname, '../subscribers/*.{js,ts}'),
    ],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscribers',
    },
  };

  return createConnection(connectionOptions);
};
