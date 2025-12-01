import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
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
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (error) {
      if (__DEV__) console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = useCallback(async (authToken, refreshToken, userData) => {
    await saveAuthData(authToken, refreshToken, userData);
    setUser(userData);
    setToken(authToken);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthData();
    setUser(null);
    setToken(null);
    setIsVoluntario(false);
  }, []);

  const updateVoluntarioStatus = useCallback((status) => {
    setIsVoluntario(status);
  }, []);

  const updateUser = useCallback(async (updatedUserData) => {
    const { token: currentToken, refreshToken } = await getAuthData();
    await saveAuthData(currentToken, refreshToken, updatedUserData);
    setUser(updatedUserData);
  }, []);

  const value = useMemo(() => ({
    signed: !!user && !!token,
    user,
    token,
    loading,
    isVoluntario,
    signIn,
    signOut,
    updateVoluntarioStatus,
    updateUser,
  }), [user, token, loading, isVoluntario, signIn, signOut, updateVoluntarioStatus, updateUser]);

  return (
    <AuthContext.Provider value={value}>
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
