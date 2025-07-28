import axios from 'axios';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: '/api', // This will be proxied to our backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const { data } = await refreshToken();
        const { token } = data;
        
        // Save the new token
        localStorage.setItem('token', token);
        
        // Update the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, logout the user
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar el usuario');
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el token');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al solicitar restablecimiento de contraseña');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener la información del usuario');
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/me', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el perfil');
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cambiar la contraseña');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/auth/login';
  }
};

// Export the configured axios instance for other services to use
export default api;
