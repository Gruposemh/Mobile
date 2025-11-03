import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";

import TelaInicio from "./screens/TelaInicio";
import TelaInicioDois from "./screens/TelaInicioDois";
import CadastrarUsuario from "./screens/CadastrarUsuario";
import Login from "./screens/Login";
import RecuperacaoSenha from "./screens/RecuperacaoSenha";
import TelaSMS from "./screens/TelaSMS";
import TelaEmail from "./screens/TelaEmail";
import Home from "./screens/Home";
import SaibaMais from "./screens/SaibaMais";
import VerMais from "./screens/VerMais";
import DoacaoDinheiro from "./screens/DoacaoDinheiro";
import DoacaoMateriais from "./screens/DoacaoMateriais";
import Menu from "./components/Menu";
import Perfil from "./screens/Perfil";
import EditarPerfil from "./screens/EditarPerfil";
import Notificacoes from "./screens/Notificacoes";
import Informacoes from "./screens/Informacoes";

const Pilha = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Raleway-Bold": require("./assets/fonts/Raleway-Bold.ttf"),
    "NunitoSans-Light": require("./assets/fonts/NunitoLight-K7dKW.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator
        initialRouteName="Inicio"
        screenOptions={{ headerShown: false }}
      >
        <Pilha.Screen name="Inicio" component={TelaInicio} />
        <Pilha.Screen name="InicioDois" component={TelaInicioDois} />
        <Pilha.Screen name="CadastrarUsuario" component={CadastrarUsuario} />
        <Pilha.Screen name="Login" component={Login} />
        <Pilha.Screen name="RecuperacaoSenha" component={RecuperacaoSenha} />
        <Pilha.Screen name="TelaSMS" component={TelaSMS} />
        <Pilha.Screen name="TelaEmail" component={TelaEmail} />
        <Pilha.Screen name="Home" component={Home} />
        <Pilha.Screen name="SaibaMais" component={SaibaMais} />
        <Pilha.Screen name="VerMais" component={VerMais} />
        <Pilha.Screen name="DoacaoDinheiro" component={DoacaoDinheiro} />
        <Pilha.Screen name="DoacaoMateriais" component={DoacaoMateriais} />
        <Pilha.Screen name="Perfil" component={Perfil} />
        <Pilha.Screen name="EditarPerfil" component={EditarPerfil} />
        <Pilha.Screen name="Notificacoes" component={Notificacoes} />
        <Pilha.Screen name="Informacoes" component={Informacoes} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
