import api from './api';

export const listarAtividades = async () => {
  try {
    const response = await api.get('/curso/listar');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar atividades',
    };
  }
};

export const listarAtividadesDisponiveis = async (usuarioId) => {
  try {
    const response = await api.get(`/curso/disponiveis/${usuarioId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar atividades disponíveis',
    };
  }
};

export const inscreverAtividade = async (usuarioId, cursoId) => {
  try {
    const response = await api.post('/inscricao/inscrever', {
      idUsuario: usuarioId,
      idCurso: cursoId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro ao inscrever em atividade:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Erro ao se inscrever na atividade',
    };
  }
};

export const listarInscricoes = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricao/usuario/${usuarioId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar inscrições',
    };
  }
};

export const cancelarInscricao = async (inscricaoId) => {
  try {
    const response = await api.delete(`/inscricao/cancelar/${inscricaoId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao cancelar inscrição',
    };
  }
};
