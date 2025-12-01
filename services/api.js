import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api.config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Reduzido para 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    if (__DEV__) {
      console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`);
    }
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (__DEV__) console.error('❌ Erro no request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isVoluntarioCheck = error.config?.url?.includes('/voluntario/usuario/');
    const is404 = error.response?.status === 404;
    
    // Tratamento de erros de rede
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Tempo de conexão esgotado. Verifique sua internet.';
      } else if (error.message === 'Network Error') {
        error.message = 'Erro de conexão. Verifique sua internet.';
      }
      return Promise.reject(error);
    }
    
    const status = error.response.status;
    
    switch (status) {
      case 401:
        await AsyncStorage.multiRemove(['token', 'user', 'refreshToken']);
        error.message = 'Sessão expirada. Faça login novamente.';
        break;
      case 403:
        error.message = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        if (!isVoluntarioCheck) {
          error.message = 'Recurso não encontrado.';
        }
        break;
      case 500:
        error.message = 'Erro no servidor. Tente novamente mais tarde.';
        break;
      case 503:
        error.message = 'Serviço temporariamente indisponível.';
        break;
    }
    
    return Promise.reject(error);
  }
);

export default api;
