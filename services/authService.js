import api from './api';

export const testConnection = async () => {
  try {
    const response = await api.get('/evento/listar');
    console.log('Conexão com back-end OK!');
    console.log('Eventos:', response.data);
    return true;
  } catch (error) {
    console.error('Erro na conexão:', error.message);
    return false;
  }
};

export const registerUser = async (nome, email, senha) => {
  try {
    console.log('Enviando cadastro:', { nome, email });
    const response = await api.post('/auth/register-modern', {
      nome,
      email,
      senha,
    });
    console.log('Cadastro bem-sucedido:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no cadastro:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Erro ao cadastrar',
    };
  }
};

export const verifyEmail = async (email, codigo) => {
  try {
    console.log('Verificando email:', { email, codigo });
    const response = await api.post('/auth/verify-email-modern', {
      email,
      codigo,
    });
    console.log('Email verificado:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro na verificação:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Código inválido',
    };
  }
};

export const login = async (email, senha) => {
  try {
    console.log('Tentando login:', { email });
    const response = await api.post('/auth/login', {
      email,
      senha,
    });
    console.log('Login bem-sucedido:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Erro ao fazer login',
    };
  }
};

export const requestOTP = async (email) => {
  try {
    const response = await api.post('/auth/request-otp', { email });
    return { success: true, data: response.data };
  } catch (error) {
    let message = 'Erro ao solicitar código';
    
    if (error.response?.status === 429) {
      message = 'Muitas tentativas. Aguarde alguns minutos.';
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    
    return {
      success: false,
      message,
    };
  }
};

export const loginOTP = async (email, token) => {
  try {
    const response = await api.post('/auth/login-otp', {
      email,
      token,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Código inválido',
    };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/request-password-reset', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao solicitar reset',
    };
  }
};

export const resetPassword = async (email, token, novaSenha) => {
  try {
    const response = await api.post('/auth/reset-password', {
      email,
      token,
      novaSenha,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao resetar senha',
    };
  }
};

export const getCurrentUser = async (token) => {
  try {
    console.log('Buscando dados do usuário logado');
    const response = await api.get('/auth/token-status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Usuário encontrado:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Erro ao buscar usuário',
    };
  }
};

export const googleLogin = async (credential) => {
  try {
    console.log('Tentando login com Google');
    const response = await api.post('/google-auth/verify', {
      credential,
    });
    console.log('Login Google bem-sucedido:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no login Google:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.error || error.message || 'Erro ao fazer login com Google',
    };
  }
};
