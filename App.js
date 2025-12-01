import React, { useEffect, useCallback, memo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { ActivityIndicator, View, Linking, LogBox, Image, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./context/AuthContext";
import * as WebBrowser from 'expo-web-browser';

// Ignorar logs desnecessários em produção
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle:',
]);

// Lazy loading das telas para melhor performance
const TelaInicio = React.lazy(() => import("./screens/TelaInicio"));
const TelaInicioDois = React.lazy(() => import("./screens/TelaInicioDois"));
const CadastrarUsuario = React.lazy(() => import("./screens/CadastrarUsuario"));
const VerificarEmail = React.lazy(() => import("./screens/VerificarEmail"));
const Login = React.lazy(() => import("./screens/Login"));
const RecuperacaoSenha = React.lazy(() => import("./screens/RecuperacaoSenha"));
const TelaSMS = React.lazy(() => import("./screens/TelaSMS"));
const TelaEmail = React.lazy(() => import("./screens/TelaEmail"));
const Home = React.lazy(() => import("./screens/Home"));
const SaibaMais = React.lazy(() => import("./screens/SaibaMais"));
const VerMais = React.lazy(() => import("./screens/VerMais"));
const DoacaoDinheiro = React.lazy(() => import("./screens/DoacaoDinheiro"));
const DoacaoMateriais = React.lazy(() => import("./screens/DoacaoMateriais"));
const Perfil = React.lazy(() => import("./screens/Perfil"));
const EditarPerfil = React.lazy(() => import("./screens/EditarPerfil"));
const Notificacoes = React.lazy(() => import("./screens/Notificacoes"));
const Informacoes = React.lazy(() => import("./screens/Informacoes"));
const MinhaAgenda = React.lazy(() => import("./screens/MinhaAgenda"));
const TornarVoluntario = React.lazy(() => import("./screens/TornarVoluntario"));
const CancelarVoluntariado = React.lazy(() => import("./screens/CancelarVoluntariado"));
const Atividades = React.lazy(() => import("./screens/Atividades"));

const Pilha = createNativeStackNavigator();

// Tela de Splash/Loading com logo centralizada
const SplashScreen = memo(() => (
  <View style={splashStyles.container}>
    <View style={splashStyles.conteudo}>
      <Image
        source={require('./assets/images/logoOng.png')}
        style={splashStyles.logo}
        resizeMode="contain"
      />
      <Text style={splashStyles.texto}>Voluntários</Text>
    </View>
  </View>
));

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteudo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 124,
    height: 125,
    marginBottom: 10,
  },
  texto: {
    fontSize: 46,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    color: '#000000',
  },
});

// Componente de loading para Suspense (usa o mesmo visual da splash)
const LoadingFallback = memo(() => (
  <View style={splashStyles.container}>
    <View style={splashStyles.conteudo}>
      <Image
        source={require('./assets/images/logoOng.png')}
        style={splashStyles.logo}
        resizeMode="contain"
      />
      <Text style={splashStyles.texto}>Voluntários</Text>
    </View>
  </View>
));

// Wrapper para telas com Suspense
const withSuspense = (Component) => {
  return memo((props) => (
    <React.Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </React.Suspense>
  ));
};

// Telas com Suspense
const TelaInicioScreen = withSuspense(TelaInicio);
const TelaInicioDoisScreen = withSuspense(TelaInicioDois);
const CadastrarUsuarioScreen = withSuspense(CadastrarUsuario);
const VerificarEmailScreen = withSuspense(VerificarEmail);
const LoginScreen = withSuspense(Login);
const RecuperacaoSenhaScreen = withSuspense(RecuperacaoSenha);
const TelaSMSScreen = withSuspense(TelaSMS);
const TelaEmailScreen = withSuspense(TelaEmail);
const HomeScreen = withSuspense(Home);
const SaibaMaisScreen = withSuspense(SaibaMais);
const VerMaisScreen = withSuspense(VerMais);
const DoacaoDinheiroScreen = withSuspense(DoacaoDinheiro);
const DoacaoMateriaisScreen = withSuspense(DoacaoMateriais);
const PerfilScreen = withSuspense(Perfil);
const EditarPerfilScreen = withSuspense(EditarPerfil);
const NotificacoesScreen = withSuspense(Notificacoes);
const InformacoesScreen = withSuspense(Informacoes);
const MinhaAgendaScreen = withSuspense(MinhaAgenda);
const TornarVoluntarioScreen = withSuspense(TornarVoluntario);
const CancelarVoluntariadoScreen = withSuspense(CancelarVoluntariado);
const AtividadesScreen = withSuspense(Atividades);

function AppNavigator() {
  const { signed, loading, signIn } = useAuth();

  const handleDeepLink = useCallback(async (event) => {
    const url = event?.url;
    if (!url || !url.includes('oauth2/callback')) return;

    try {
      const params = new URLSearchParams(url.split('?')[1]);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');
      const email = params.get('email');
      const role = params.get('role');
      const id = params.get('id');
      const nome = params.get('nome');

      if (token && refreshToken && email) {
        const userData = {
          id: parseInt(id),
          nome: nome ? decodeURIComponent(nome) : email.split('@')[0],
          email,
          role,
        };
        WebBrowser.dismissBrowser();
        await signIn(token, refreshToken, userData);
      }
    } catch (error) {
      console.error('Erro ao processar deep link:', error);
    }
  }, [signIn]);

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [handleDeepLink]);

  // Mostra a splash enquanto carrega autenticação
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: ['voluntariosprobem://'],
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
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        {!signed ? (
          <>
            <Pilha.Screen name="Inicio" component={TelaInicioScreen} />
            <Pilha.Screen name="InicioDois" component={TelaInicioDoisScreen} />
            <Pilha.Screen name="CadastrarUsuario" component={CadastrarUsuarioScreen} />
            <Pilha.Screen name="VerificarEmail" component={VerificarEmailScreen} />
            <Pilha.Screen name="Login" component={LoginScreen} />
            <Pilha.Screen name="RecuperacaoSenha" component={RecuperacaoSenhaScreen} />
            <Pilha.Screen name="TelaSMS" component={TelaSMSScreen} />
            <Pilha.Screen name="TelaEmail" component={TelaEmailScreen} />
          </>
        ) : (
          <>
            <Pilha.Screen name="Home" component={HomeScreen} />
            <Pilha.Screen name="SaibaMais" component={SaibaMaisScreen} />
            <Pilha.Screen name="VerMais" component={VerMaisScreen} />
            <Pilha.Screen name="DoacaoDinheiro" component={DoacaoDinheiroScreen} />
            <Pilha.Screen name="DoacaoMateriais" component={DoacaoMateriaisScreen} />
            <Pilha.Screen name="Perfil" component={PerfilScreen} />
            <Pilha.Screen name="EditarPerfil" component={EditarPerfilScreen} />
            <Pilha.Screen name="Notificacoes" component={NotificacoesScreen} />
            <Pilha.Screen name="Informacoes" component={InformacoesScreen} />
            <Pilha.Screen name="MinhaAgenda" component={MinhaAgendaScreen} />
            <Pilha.Screen name="TornarVoluntario" component={TornarVoluntarioScreen} />
            <Pilha.Screen name="CancelarVoluntariado" component={CancelarVoluntariadoScreen} />
            <Pilha.Screen name="Atividades" component={AtividadesScreen} />
          </>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Raleway-Bold": require("./assets/fonts/Raleway-Bold.ttf"),
    "NunitoSans-Light": require("./assets/fonts/NunitoLight-K7dKW.ttf"),
  });

  // Mostra splash enquanto fontes carregam
  if (!fontsLoaded) {
    return (
      <View style={splashStyles.container}>
        <View style={splashStyles.conteudo}>
          <Image
            source={require('./assets/images/logoOng.png')}
            style={splashStyles.logo}
            resizeMode="contain"
          />
          <ActivityIndicator size="small" color="#b20000" style={{ marginTop: 20 }} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
