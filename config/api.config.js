// ========================================
// CONFIGURAÇÃO CENTRALIZADA DA API
// ========================================

// 🔧 ALTERE AQUI PARA TROCAR ENTRE LOCAL E AZURE
export const USE_LOCAL = false; // true = local, false = Azure

// URLs disponíveis
export const LOCAL_API_URL = 'http://192.168.15.14:8080';
export const AZURE_API_URL = 'https://ong-a2hzbucweddredb7.brazilsouth-01.azurewebsites.net';

// URL que será usada
export const API_URL = USE_LOCAL ? LOCAL_API_URL : AZURE_API_URL;

// Log apenas em desenvolvimento
if (__DEV__) {
  console.log('🔧 API:', USE_LOCAL ? 'LOCAL' : 'AZURE', '-', API_URL);
}
