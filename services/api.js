import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: URL do back-end em produção
// Para desenvolvimento local, use: http://192.168.15.14:8080
// Para produção, use a URL do Azure
const API_URL = 'https://ong-a2hzbucweddredb7.brazilsouth-01.azurewebsites.net';

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
    console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`);
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
    if (error.response) {
      console.error(`❌ Response Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error - Sem resposta do servidor');
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
