// In-memory database for users and sessions
const users = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@admin.com',
    password: 'admin', // In a real app, this would be hashed
    role: 'admin',
    emailVerified: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    lastLogin: null
  },
  {
    id: 2,
    name: 'Cliente Ejemplo',
    email: 'cliente@ejemplo.com',
    password: 'cliente123',
    role: 'customer',
    emailVerified: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
    lastLogin: null
  }
];

const sessions = [];
const passwordResetTokens = [];
const emailVerificationTokens = [];

// Helper function to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate tokens
const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

export default {
  // Login with email and password
  async login({ email, password }) {
    await delay(300); // Simulate network delay
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    if (!user.emailVerified) {
      throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión');
    }

    // Generate access and refresh tokens
    const accessToken = `access_${generateToken(32)}`;
    const refreshToken = `refresh_${generateToken(32)}`;
    
    // Create session
    const session = {
      id: `sess_${generateToken(16)}`,
      userId: user.id,
      accessToken,
      refreshToken,
      userAgent: navigator?.userAgent || 'unknown',
      ip: '127.0.0.1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      createdAt: new Date()
    };
    
    sessions.push(session);
    
    // Update last login
    user.lastLogin = new Date();
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      },
      accessToken,
      refreshToken,
      expiresIn: 3600 // 1 hour in seconds
    };
  },
  
  // Logout and clear session
  async logout(accessToken) {
    await delay(200);
    const sessionIndex = sessions.findIndex(s => s.accessToken === accessToken);
    if (sessionIndex > -1) {
      sessions.splice(sessionIndex, 1);
    }
    return { success: true };
  },
  
  // Register a new user
  async register({ name, email, password }) {
    await delay(400);
    
    if (users.some(u => u.email === email)) {
      throw new Error('Este correo electrónico ya está registrado');
    }
    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'customer',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    users.push(newUser);
    
    // Generate email verification token
    const verificationToken = generateToken(32);
    emailVerificationTokens.push({
      token: verificationToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    });
    
    // In a real app, you would send an email with the verification link
    console.log(`Email verification link: /verify-email?token=${verificationToken}`);
    
    return {
      success: true,
      message: 'Registro exitoso. Por favor verifica tu correo electrónico.'
    };
  },
  
  // Verify email with token
  async verifyEmail(token) {
    await delay(300);
    
    const now = new Date();
    const tokenIndex = emailVerificationTokens.findIndex(
      t => t.token === token && t.expiresAt > now
    );
    
    if (tokenIndex === -1) {
      throw new Error('Token de verificación inválido o expirado');
    }
    
    const { userId } = emailVerificationTokens[tokenIndex];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    user.emailVerified = true;
    user.updatedAt = new Date();
    
    // Remove used token
    emailVerificationTokens.splice(tokenIndex, 1);
    
    return {
      success: true,
      message: 'Correo electrónico verificado exitosamente.'
    };
  },
  
  // Request password reset
  async forgotPassword(email) {
    await delay(300);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return { success: true };
    }
    
    // Generate reset token
    const resetToken = generateToken(32);
    passwordResetTokens.push({
      token: resetToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    });
    
    // In a real app, you would send an email with the reset link
    console.log(`Password reset link: /reset-password?token=${resetToken}`);
    
    return { success: true };
  },
  
  // Reset password with token
  async resetPassword({ token, newPassword }) {
    await delay(300);
    
    const now = new Date();
    const tokenIndex = passwordResetTokens.findIndex(
      t => t.token === token && t.expiresAt > now
    );
    
    if (tokenIndex === -1) {
      throw new Error('Token de restablecimiento inválido o expirado');
    }
    
    const { userId } = passwordResetTokens[tokenIndex];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Update password
    user.password = newPassword; // In a real app, this would be hashed
    user.updatedAt = new Date();
    
    // Remove used token
    passwordResetTokens.splice(tokenIndex, 1);
    
    // Invalidate all user sessions
    const userSessions = sessions.filter(s => s.userId === userId);
    userSessions.forEach(session => {
      const index = sessions.findIndex(s => s.id === session.id);
      if (index > -1) {
        sessions.splice(index, 1);
      }
    });
    
    return { success: true, message: 'Contraseña actualizada exitosamente' };
  },
  
  // Get current user from token
  async getMe(accessToken) {
    await delay(200);
    
    const session = sessions.find(s => s.accessToken === accessToken);
    if (!session) {
      throw new Error('No autorizado');
    }
    
    const user = users.find(u => u.id === session.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
  },
  
  // Refresh access token
  async refreshToken(refreshToken) {
    await delay(200);
    
    const session = sessions.find(s => s.refreshToken === refreshToken);
    if (!session || new Date() > new Date(session.expiresAt)) {
      throw new Error('Sesión expirada o inválida');
    }
    
    // Generate new access token
    const newAccessToken = `access_${generateToken(32)}`;
    session.accessToken = newAccessToken;
    
    return {
      accessToken: newAccessToken,
      expiresIn: 3600 // 1 hour in seconds
    };
  }
};
