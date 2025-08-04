// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Interceptor para reintentos
api.interceptors.response.use(null, async (error) => {
  const { config, message } = error;
  if (!config || !config.retry) return Promise.reject(error);
  
  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= config.retry) return Promise.reject(error);
  
  config.__retryCount += 1;
  const delay = 1000 * config.__retryCount;
  
  await new Promise(resolve => setTimeout(resolve, delay));
  return api(config);
});