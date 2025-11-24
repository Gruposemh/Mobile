import api from './api';

export const listarEventos = async () => {
  try {
    const response = await api.get('/evento/listar');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar eventos',
    };
  }
};

export const buscarEvento = async (id) => {
  try {
    const response = await api.get(`/evento/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar evento',
    };
  }
};

export const listarParticipacoes = async (idUsuario) => {
  try {
    const response = await api.get(`/participar/usuario/${idUsuario}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar participações',
    };
  }
};

export const inscreverEvento = async (idUsuario, idEvento) => {
  try {
    const response = await api.post('/participar', {
      idUsuario,
      idEvento,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao se inscrever',
    };
  }
};

export const cancelarInscricao = async (id) => {
  try {
    const response = await api.delete(`/participar/deletar/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao cancelar inscrição',
    };
  }
};

export const confirmarPresenca = async (id) => {
  try {
    const response = await api.put(`/participar/confirmar/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao confirmar presença',
    };
  }
};
