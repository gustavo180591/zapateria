import { Resolver } from 'type-graphql';
import { UserResolver } from './UserResolver';

// Export all resolvers
export const resolvers = [
  UserResolver,
] as const;
