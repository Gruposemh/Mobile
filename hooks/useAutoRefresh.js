import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Hook para auto-refresh de dados
 * @param {Function} refreshFunction - Função que será chamada para atualizar os dados
 * @param {number} interval - Intervalo em milissegundos (padrão: 30 segundos)
 * @param {boolean} refreshOnFocus - Se deve atualizar ao focar na tela (padrão: true)
 * @param {boolean} refreshOnAppForeground - Se deve atualizar ao voltar para o app (padrão: true)
 */
export const useAutoRefresh = (
  refreshFunction,
  interval = 30000, // 30 segundos
  refreshOnFocus = true,
  refreshOnAppForeground = true
) => {
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // Auto-refresh periódico
  useEffect(() => {
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refresh: Atualizando dados...');
        refreshFunction();
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refreshFunction, interval]);

  // Refresh ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      if (refreshOnFocus) {
        console.log('👁️ Tela focada: Atualizando dados...');
        refreshFunction();
      }
    }, [refreshFunction, refreshOnFocus])
  );

  // Refresh ao voltar para o app (foreground)
  useEffect(() => {
    if (!refreshOnAppForeground) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('📱 App voltou ao foreground: Atualizando dados...');
        refreshFunction();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription?.remove();
    };
  }, [refreshFunction, refreshOnAppForeground]);
};

export default useAutoRefresh;
