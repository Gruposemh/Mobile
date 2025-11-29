import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api.config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos para operações que envolvem email
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    console.log(`🌐 ${config.method.toUpperCase()} ${API_URL}${config.url}`);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.status}:`, response.data);
    return response;
  },
  async (error) => {
    // Não logar erros 404 em /voluntario/usuario (é esperado quando usuário não é voluntário)
    const isVoluntarioCheck = error.config?.url?.includes('/voluntario/usuario/');
    const is404 = error.response?.status === 404;
    
    if (error.response) {
      // Só logar se não for um 404 esperado
      if (!(is404 && isVoluntarioCheck)) {
        console.error(`❌ Response Error ${error.response.status} em ${error.config?.url}:`, error.response.data);
      }
    } else if (error.request) {
      console.error('❌ Network Error - Sem resposta do servidor para:', error.config?.url);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Token expirado - fazer logout
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
