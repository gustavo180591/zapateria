import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema } from 'type-graphql';
import { ApolloServerLoaderPlugin } from 'type-graphql-dataloader';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: join(__dirname, '../../.env') });

// Import resolvers
import { resolvers } from './resolvers';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { authChecker } from './middleware/auth.middleware';

// Import logger
import { logger, stream } from './utils/logger';

// Initialize Redis pub/sub
const pubSub = new RedisPubSub({
  connection: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Create Express app
const app = express();
const httpServer = createServer(app);

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('combined', { stream }));

// GraphQL Upload middleware
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Import and use REST routes
import helloRoutes from './api/routes/hello.routes';
app.use('/api', helloRoutes);


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize Apollo Server
async function startServer() {
  try {
    // Create database connection
    await createConnection();
    logger.info('📦 Connected to database');

    // Build GraphQL schema
    const schema = await buildSchema({
      resolvers,
      authChecker,
      pubSub,
      validate: false,
    });

    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({
        req,
        res,
        pubSub,
      }),
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerLoaderPlugin(),
      ],
      uploads: false, // Disable built-in upload handling
    });

    // Start Apollo Server
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Start server
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

export { app };
