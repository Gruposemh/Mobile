import api from './api';

export const verificarVoluntario = async (idUsuario) => {
  try {
    const response = await api.get(`/voluntario/usuario/${idUsuario}`);
    return { success: true, data: response.data, isVoluntario: true };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: true, isVoluntario: false };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao verificar voluntário',
    };
  }
};

export const tornarVoluntario = async (dados) => {
  try {
    const response = await api.post('/voluntario/tornar', dados);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao se tornar voluntário',
    };
  }
};
