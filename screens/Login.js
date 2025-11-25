import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { login } from "../services/authService";
import { loginWithGoogle } from "../services/googleAuthService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import GoogleIcon from "../components/GoogleIcon";

const Login = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleLogin = async () => {
    if (!email || !senha) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    setLoading(true);
    const result = await login(email, senha);
    
    if (result.success) {
      const { token, refreshToken, email: userEmail, role, id, nome } = result.data;
      
      console.log('Dados recebidos do login:', { id, nome, email: userEmail, role });
      
      // Criar objeto de usuário com todos os dados
      const userData = {
        id: id,
        nome: nome,
        email: userEmail,
        role: role,
      };
      
      console.log('Salvando dados do usuário:', userData);
      
      await signIn(token, refreshToken, userData);
      
      console.log('Login concluído');
      setLoading(false);
      
      // Não navegar manualmente - o App.js vai redirecionar automaticamente
    } else {
      setLoading(false);
      showToast(result.message, "error");
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleRecuperacao = () => {
    navigation.navigate("RecuperacaoSenha");
  };

  const handleLoginOTP = () => {
    navigation.navigate("TelaEmail");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    showToast("Abrindo Google...", "info");
    
    const result = await loginWithGoogle();
    
    if (result.success) {
      const { token, refreshToken, email, role, id, nome } = result.data;
      
      console.log('Dados recebidos do Google:', { id, nome, email, role });
      
      const userData = {
        id: id,
        nome: nome,
        email: email,
        role: role,
      };
      
      console.log('Salvando dados do usuário Google:', userData);
      
      await signIn(token, refreshToken, userData);
      
      console.log('Login com Google concluído');
      showToast("Login realizado com sucesso!", "success");
      setLoading(false);
    } else if (result.waiting) {
      // Aguardando deep link - não mostrar erro
      console.log('⏳ Aguardando retorno do navegador...');
      // Manter loading por mais tempo
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setLoading(false);
      showToast(result.message || "Erro ao fazer login com Google", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <View style={styles.container}>
        <Image
          source={require("../assets/images/fundo2.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
          fadeDuration={0}
        />

        <View style={styles.content}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Login</Text>
            <Image
              source={require("../assets/images/logoOng.png")}
              style={styles.logo}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>

          <Text style={styles.subtexto}>Bom te ver de novo!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.inputSenhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity 
              style={styles.botaoOlho}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons 
                name={mostrarSenha ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

            <View style={styles.linhaOpcoes}>
              <TouchableOpacity onPress={handleRecuperacao}>
                <Text style={styles.textoEsqueceu}>Esqueceu a senha?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleLoginOTP}>
                <Text style={styles.textoOTP}>Entrar com código</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.botao} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotao}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divisor}>
              <View style={styles.linha} />
              <Text style={styles.textoDivisor}>ou</Text>
              <View style={styles.linha} />
            </View>

            <TouchableOpacity 
              style={styles.botaoGoogle}
              onPress={handleGoogleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <GoogleIcon size={20} />
              <Text style={styles.textoBotaoGoogle}>Entrar com Google</Text>
            </TouchableOpacity>

          <TouchableOpacity onPress={handleCancelar}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5", // Cor de fundo enquanto carrega
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  tituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 130,
    marginTop: 30,
  },
  titulo: {
    fontSize: 50,
    color: "#000000ff",
    marginRight: 10,
    fontFamily: 'Raleway-Bold',
  },
  logo: {
    width: 50,
    height: 50,
  },
  subtexto: {
    fontSize: 19,
    color: "#000000ff",
    marginBottom: 15,
    paddingRight: 159,
    fontFamily: 'NunitoSans-Light',
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "90%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    width: "90%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
  },
  inputSenha: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  botaoOlho: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  botao: {
    backgroundColor: "#b20000",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 20,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'NunitoSans-Light',
  },
  textoCancelar: {
    fontSize: 16,
    color: "#000000ff",
    marginTop: 10,
    fontFamily: 'NunitoSans-Light',
  },
  linhaOpcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 15,
  },
  textoEsqueceu: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: 'NunitoSans-Light',
    textDecorationLine: "underline",
  },
  textoOTP: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: 'NunitoSans-Light',
    textDecorationLine: "underline",
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 12,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  textoDivisor: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
    fontFamily: 'NunitoSans-Light',
  },
  botaoGoogle: {
    backgroundColor: "#fff",
    width: "90%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    gap: 10,
  },
  textoBotaoGoogle: {
    color: "#333",
    fontSize: 15,
    fontFamily: 'NunitoSans-Light',
  },
});
