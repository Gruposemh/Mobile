import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuthData = async (token, refreshToken, user) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar dados de autenticação:', error);
  }
};

export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userJson = await AsyncStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    return { token, refreshToken, user };
  } catch (error) {
    console.error('Erro ao recuperar dados de autenticação:', error);
    return { token: null, refreshToken: null, user: null };
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Erro ao limpar dados de autenticação:', error);
  }
};

export const isAuthenticated = async () => {
  const { token } = await getAuthData();
  return !!token;
};
