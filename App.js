import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { ActivityIndicator, View, Linking, Image } from "react-native";
import { Asset } from 'expo-asset';
import { AuthProvider, useAuth } from "./context/AuthContext";
import * as WebBrowser from 'expo-web-browser';

import TelaInicio from "./screens/TelaInicio";
import TelaInicioDois from "./screens/TelaInicioDois";
import CadastrarUsuario from "./screens/CadastrarUsuario";
import VerificarEmail from "./screens/VerificarEmail";
import Login from "./screens/Login";
import RecuperacaoSenha from "./screens/RecuperacaoSenha";
import TelaSMS from "./screens/TelaSMS";
import TelaEmail from "./screens/TelaEmail";
import Home from "./screens/Home";
import SaibaMais from "./screens/SaibaMais";
import VerMais from "./screens/VerMais";
import DoacaoDinheiro from "./screens/DoacaoDinheiro";
import DoacaoMateriais from "./screens/DoacaoMateriais";
import Perfil from "./screens/Perfil";
import EditarPerfil from "./screens/EditarPerfil";
import Notificacoes from "./screens/Notificacoes";
import Informacoes from "./screens/Informacoes";
import MinhaAgenda from "./screens/MinhaAgenda";
import TornarVoluntario from "./screens/TornarVoluntario";
import Atividades from "./screens/Atividades";

const Pilha = createNativeStackNavigator();

function AppNavigator() {
  const { signed, loading, signIn } = useAuth();

  // Configurar listener para deep links do OAuth2
  useEffect(() => {
    // Fechar qualquer sessão de autenticação pendente
    WebBrowser.maybeCompleteAuthSession();

    // Listener para deep links
    const handleDeepLink = async (event) => {
      const url = event.url;
      console.log('🔗 Deep link recebido:', url);

      // Verificar se é callback do OAuth2
      if (url.includes('oauth2/callback')) {
        try {
          // Extrair parâmetros da URL
          const params = new URLSearchParams(url.split('?')[1]);
          
          const token = params.get('token');
          const refreshToken = params.get('refreshToken');
          const email = params.get('email');
          const role = params.get('role');
          const id = params.get('id');
          const nome = params.get('nome');

          console.log('📦 Dados recebidos do OAuth2:', { 
            token: token?.substring(0, 20) + '...', 
            email, 
            role, 
            id, 
            nome: nome ? decodeURIComponent(nome) : 'N/A'
          });

          if (token && refreshToken && email) {
            const userData = {
              id: parseInt(id),
              nome: nome ? decodeURIComponent(nome) : email.split('@')[0],
              email: email,
              role: role,
            };

            console.log('✅ Fazendo login com dados do Google...');
            
            // Fechar o navegador se ainda estiver aberto
            WebBrowser.dismissBrowser();
            
            await signIn(token, refreshToken, userData);
            console.log('✅ Login com Google concluído!');
          } else {
            console.error('❌ Dados incompletos no deep link');
            console.error('Token:', !!token, 'RefreshToken:', !!refreshToken, 'Email:', !!email);
          }
        } catch (error) {
          console.error('❌ Erro ao processar deep link:', error);
        }
      }
    };

    // Verificar se o app foi aberto via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🔗 App aberto via deep link:', url);
        handleDeepLink({ url });
      }
    });

    // Adicionar listener para deep links enquanto o app está aberto
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [signIn]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#b20000" />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: ['voluntariosprobem://', 'exp://'],
        config: {
          screens: {
            Home: 'home',
            Login: 'login',
          },
        },
      }}
    >
      <Pilha.Navigator
        initialRouteName={signed ? "Home" : "Inicio"}
        screenOptions={{ headerShown: false }}
      >
        {!signed ? (
          // Telas públicas (não autenticadas)
          <>
            <Pilha.Screen name="Inicio" component={TelaInicio} />
            <Pilha.Screen name="InicioDois" component={TelaInicioDois} />
            <Pilha.Screen name="CadastrarUsuario" component={CadastrarUsuario} />
            <Pilha.Screen name="VerificarEmail" component={VerificarEmail} />
            <Pilha.Screen name="Login" component={Login} />
            <Pilha.Screen name="RecuperacaoSenha" component={RecuperacaoSenha} />
            <Pilha.Screen name="TelaSMS" component={TelaSMS} />
            <Pilha.Screen name="TelaEmail" component={TelaEmail} />
          </>
        ) : (
          // Telas privadas (autenticadas)
          <>
            <Pilha.Screen name="Home" component={Home} />
            <Pilha.Screen name="SaibaMais" component={SaibaMais} />
            <Pilha.Screen name="VerMais" component={VerMais} />
            <Pilha.Screen name="DoacaoDinheiro" component={DoacaoDinheiro} />
            <Pilha.Screen name="DoacaoMateriais" component={DoacaoMateriais} />
            <Pilha.Screen name="Perfil" component={Perfil} />
            <Pilha.Screen name="EditarPerfil" component={EditarPerfil} />
            <Pilha.Screen name="Notificacoes" component={Notificacoes} />
            <Pilha.Screen name="Informacoes" component={Informacoes} />
            <Pilha.Screen name="MinhaAgenda" component={MinhaAgenda} />
            <Pilha.Screen name="TornarVoluntario" component={TornarVoluntario} />
            <Pilha.Screen name="Atividades" component={Atividades} />
          </>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

// Preload de imagens críticas
const cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export default function App() {
  const [appReady, setAppReady] = React.useState(false);
  
  const [fontsLoaded] = useFonts({
    "Raleway-Bold": require("./assets/fonts/Raleway-Bold.ttf"),
    "NunitoSans-Light": require("./assets/fonts/NunitoLight-K7dKW.ttf"),
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Preload de imagens críticas
        const imageAssets = cacheImages([
          require('./assets/images/fundo1.png'),
          require('./assets/images/fundo2.png'),
          require('./assets/images/logoOng.png'),
        ]);

        await Promise.all([...imageAssets]);
      } catch (e) {
        console.warn('Erro ao carregar recursos:', e);
      } finally {
        setAppReady(true);
      }
    }

    if (fontsLoaded) {
      loadResourcesAndDataAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#b20000" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
