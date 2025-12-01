import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Hook otimizado para auto-refresh de dados
 */
export const useAutoRefresh = (
  refreshFunction,
  interval = 60000, // 60 segundos
  refreshOnFocus = true,
  refreshOnAppForeground = true
) => {
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const lastRefresh = useRef(0);

  // Debounce para evitar múltiplas chamadas
  const debouncedRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefresh.current > 5000) { // Mínimo 5s entre refreshes
      lastRefresh.current = now;
      refreshFunction();
    }
  }, [refreshFunction]);

  // Auto-refresh periódico
  useEffect(() => {
    if (interval > 0) {
      intervalRef.current = setInterval(debouncedRefresh, interval);
      return () => clearInterval(intervalRef.current);
    }
  }, [debouncedRefresh, interval]);

  // Refresh ao focar na tela
  useFocusEffect(
    useCallback(() => {
      if (refreshOnFocus) {
        debouncedRefresh();
      }
    }, [debouncedRefresh, refreshOnFocus])
  );

  // Refresh ao voltar para o app
  useEffect(() => {
    if (!refreshOnAppForeground) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        debouncedRefresh();
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [debouncedRefresh, refreshOnAppForeground]);
};

export default useAutoRefresh;
