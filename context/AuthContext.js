import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthData, saveAuthData, clearAuthData } from '../utils/storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoluntario, setIsVoluntario] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const { user: storedUser, token: storedToken } = await getAuthData();
      console.log('Dados carregados do storage:', { user: storedUser, hasToken: !!storedToken });
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (authToken, refreshToken, userData) => {
    console.log('SignIn chamado com:', { userData, hasToken: !!authToken });
    await saveAuthData(authToken, refreshToken, userData);
    setUser(userData);
    setToken(authToken);
  };

  const signOut = async () => {
    console.log('SignOut chamado');
    await clearAuthData();
    setUser(null);
    setToken(null);
    setIsVoluntario(false);
  };

  const updateVoluntarioStatus = (status) => {
    setIsVoluntario(status);
  };

  const updateUser = async (updatedUserData) => {
    const { token: currentToken, refreshToken } = await getAuthData();
    await saveAuthData(currentToken, refreshToken, updatedUserData);
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user && !!token,
        user,
        token,
        loading,
        isVoluntario,
        signIn,
        signOut,
        updateVoluntarioStatus,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
