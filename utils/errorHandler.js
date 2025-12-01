import { Alert } from 'react-native';

/**
 * Tratamento centralizado de erros
 */
export const handleError = (error, customMessage = null) => {
  console.error('Error:', error);

  let message = customMessage || 'Ocorreu um erro inesperado. Tente novamente.';

  // Erros de rede
  if (error.message === 'Network request failed' || error.message === 'Failed to fetch') {
    message = 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  // Timeout
  if (error.message?.includes('timeout')) {
    message = 'A requisição demorou muito. Tente novamente.';
  }

  // Erros HTTP específicos
  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        message = 'Dados inválidos. Verifique as informações e tente novamente.';
        break;
      case 401:
        message = 'Sessão expirada. Faça login novamente.';
        break;
      case 403:
        message = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        message = 'Recurso não encontrado.';
        break;
      case 500:
        message = 'Erro no servidor. Tente novamente mais tarde.';
        break;
      case 503:
        message = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
        break;
    }
  }

  return message;
};

/**
 * Mostra um alerta de erro
 */
export const showErrorAlert = (error, customMessage = null) => {
  const message = handleError(error, customMessage);
  
  Alert.alert(
    'Erro',
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

/**
 * Wrapper seguro para chamadas de API
 */
export const safeApiCall = async (apiFunction, errorMessage = null) => {
  try {
    return await apiFunction();
  } catch (error) {
    showErrorAlert(error, errorMessage);
    throw error;
  }
};

/**
 * Validação de dados antes de enviar
 */
export const validateData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} é obrigatório`;
    }

    if (rule.email && value && !isValidEmail(value)) {
      errors[field] = 'Email inválido';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} deve ter no mínimo ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} deve ter no máximo ${rule.maxLength} caracteres`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validação de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Retry com backoff exponencial
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const waitTime = delay * Math.pow(2, i);
      console.log(`Tentativa ${i + 1} falhou. Tentando novamente em ${waitTime}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

/**
 * Debounce para evitar múltiplas chamadas
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle para limitar frequência de chamadas
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
