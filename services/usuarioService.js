import api from './api';

export const editarPerfil = async (dados) => {
  try {
    const response = await api.put('/usuario/editar-perfil', dados);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao editar perfil',
    };
  }
};

export const uploadImagemPerfil = async (imageAsset) => {
  try {
    const formData = new FormData();
    
    const filename = imageAsset.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: imageAsset.uri,
      name: filename,
      type,
    });

    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { success: true, url: response.data.url };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao fazer upload da imagem',
    };
  }
};

export const buscarUsuario = async (id) => {
  try {
    const response = await api.get(`/usuario/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar usuário',
    };
  }
};
