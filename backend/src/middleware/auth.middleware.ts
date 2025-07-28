import { AuthChecker } from 'type-graphql';
import { Context } from '../types/context';
import { verify } from 'jsonwebtoken';
import { User } from '../entities/User';

export const authChecker: AuthChecker<Context> = async (
  { root, args, context, info },
  roles
) => {
  const { req } = context;
  
  // Get the authorization header
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader) {
    return false;
  }

  // Extract the token
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return false;
  }

  try {
    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as any;
    
    // Get the user from the database
    const user = await User.findOne(decoded.userId);
    
    if (!user) {
      return false;
    }

    // Add user to context
    context.user = user;

    // Check roles if any
    if (roles.length > 0) {
      return roles.includes(user.role);
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Middleware to check if user is authenticated
export const isAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};
