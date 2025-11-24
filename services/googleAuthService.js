import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform, Linking } from 'react-native';

// URL da API - deve ser o mesmo IP do api.js
const API_URL = 'http://192.168.15.14:8080';

// Necessário para fechar o navegador após o login
WebBrowser.maybeCompleteAuthSession();

/**
 * Configuração do Google OAuth2 para mobile
 */
const GOOGLE_CLIENT_ID = '750484993221-dnb8ht7k5456jlp4ps5ulcrfo4t6uopd.apps.googleusercontent.com';

/**
 * Inicia o fluxo de login com Google
 * @returns {Promise<Object>} Resultado do login com tokens e dados do usuário
 */
export const loginWithGoogle = async () => {
  try {
    console.log('🔵 Iniciando login com Google...');
    console.log('📍 API_URL:', API_URL);
    
    // URL do backend OAuth2
    const authUrl = `${API_URL}/oauth2/authorization/google?mobile=true`;
    
    console.log('🌐 URL de autenticação:', authUrl);
    
    // Criar redirect URI dinamicamente
    const redirectUri = AuthSession.makeRedirectUri({
      path: 'oauth2/callback'
    });
    
    console.log('🔗 Redirect URI:', redirectUri);
    
    // Tentar abrir o navegador
    let result;
    
    try {
      // Para Android, usar browserPackage pode ajudar
      const browserOptions = Platform.OS === 'android' 
        ? { 
            showTitle: true,
            enableBarCollapsing: false,
            // Forçar uso do Chrome se disponível
            browserPackage: 'com.android.chrome'
          }
        : {};
      
      result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        browserOptions
      );
    } catch (browserError) {
      console.error('❌ Erro ao abrir navegador:', browserError);
      
      // Fallback: tentar abrir URL diretamente
      if (Platform.OS === 'android') {
        console.log('🔄 Tentando abrir URL diretamente...');
        const canOpen = await Linking.canOpenURL(authUrl);
        if (canOpen) {
          await Linking.openURL(authUrl);
          return {
            success: false,
            message: 'Por favor, complete o login no navegador e volte ao app'
          };
        }
      }
      
      throw browserError;
    }
    
    console.log('📱 Resultado do navegador:', result);
    
    if (result.type === 'success') {
      // Extrair parâmetros da URL de callback
      const url = result.url;
      const params = new URLSearchParams(url.split('?')[1]);
      
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');
      const email = params.get('email');
      const role = params.get('role');
      const id = params.get('id');
      const nome = params.get('nome');
      
      if (token && refreshToken && email) {
        console.log('✅ Login com Google bem-sucedido!');
        return {
          success: true,
          data: {
            token,
            refreshToken,
            email,
            role,
            id: parseInt(id),
            nome: decodeURIComponent(nome)
          }
        };
      } else {
        console.error('❌ Tokens não encontrados na resposta');
        return {
          success: false,
          message: 'Erro ao processar resposta do servidor'
        };
      }
    } else if (result.type === 'cancel') {
      console.log('⚠️ Login cancelado pelo usuário');
      return {
        success: false,
        message: 'Login cancelado'
      };
    } else {
      console.error('❌ Erro no login:', result);
      return {
        success: false,
        message: 'Erro ao fazer login com Google'
      };
    }
  } catch (error) {
    console.error('❌ Erro no loginWithGoogle:', error);
    
    // Mensagem mais amigável para erro de navegador
    if (error.message && error.message.includes('browser activity')) {
      return {
        success: false,
        message: 'Navegador não disponível. Instale o Chrome ou atualize o Google Play Services.'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Erro ao conectar com Google'
    };
  }
};

/**
 * Alternativa: Login com Google usando Expo AuthSession (mais robusto)
 */
export const loginWithGoogleAuthSession = async () => {
  try {
    console.log('🔵 Iniciando login com Google (AuthSession)...');
    
    // Criar redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
      path: 'oauth2/callback'
    });
    
    console.log('🔗 Redirect URI:', redirectUri);
    
    // Configurar discovery do Google
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };
    
    // Criar request
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
      },
      discovery
    );
    
    if (!request) {
      return {
        success: false,
        message: 'Erro ao criar requisição de autenticação'
      };
    }
    
    // Iniciar fluxo de autenticação
    const result = await promptAsync();
    
    console.log('📱 Resultado AuthSession:', result);
    
    if (result.type === 'success') {
      // Enviar código para o backend
      const code = result.params.code;
      
      // Aqui você pode enviar o código para seu backend processar
      // ou usar o token diretamente
      
      return {
        success: true,
        data: result.params
      };
    } else {
      return {
        success: false,
        message: 'Login cancelado ou falhou'
      };
    }
  } catch (error) {
    console.error('❌ Erro no loginWithGoogleAuthSession:', error);
    return {
      success: false,
      message: error.message || 'Erro ao conectar com Google'
    };
  }
};

export default {
  loginWithGoogle,
  loginWithGoogleAuthSession
};
