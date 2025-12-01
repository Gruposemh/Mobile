import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from "../services/authService";
import { loginWithGoogle } from "../services/googleAuthService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import GoogleIcon from "../components/GoogleIcon";

const CadastrarUsuario = ({ navigation }) => {
  const { signIn } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCriar = async () => {
    if (!nome || !email || !senha) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    if (senha.length < 6) {
      showToast("A senha deve ter no mínimo 6 caracteres", "error");
      return;
    }

    setLoading(true);
    const result = await registerUser(nome, email, senha);
    setLoading(false);

    if (result.success) {
      showToast("Cadastro realizado! Verifique seu email.", "success");
      setTimeout(() => {
        navigation.navigate("VerificarEmail", { email });
      }, 1000);
    } else {
      showToast(result.message, "error");
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
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
      showToast("Cadastro realizado com sucesso!", "success");
      setLoading(false);
    } else if (result.waiting) {
      console.log('⏳ Aguardando retorno do navegador...');
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <View style={estilos.container}>
        <Image 
          source={require("../assets/images/fundo1.png")} 
          style={estilos.image}
          fadeDuration={0}
        />

        <View style={estilos.espacoSuperior} />

        <View style={estilos.conteudoInferior}>
          <View style={estilos.tituloContainer}>
            <Text style={estilos.texto}>Cadastrar {"\n"}usuário</Text>
          </View>

          <TextInput
            style={estilos.input}
            placeholder="Nome"
            placeholderTextColor="#aaa"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={estilos.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={estilos.inputSenhaContainer}>
            <TextInput
              style={estilos.inputSenha}
              placeholder="Senha (mínimo 6 caracteres)"
              placeholderTextColor="#aaa"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />
            <TouchableOpacity 
              style={estilos.botaoOlho}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons 
                name={mostrarSenha ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <View style={estilos.areaInferior}>
            <TouchableOpacity 
              style={estilos.botaoCriar} 
              onPress={handleCriar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={estilos.textoCadastrar}>Criar</Text>
              )}
            </TouchableOpacity>

            <View style={estilos.divisor}>
              <View style={estilos.linha} />
              <Text style={estilos.textoDivisor}>ou</Text>
              <View style={estilos.linha} />
            </View>

            <TouchableOpacity 
              style={estilos.botaoGoogle}
              onPress={handleGoogleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <GoogleIcon size={20} />
              <Text style={estilos.textoBotaoGoogle}>Entrar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCancelar} style={estilos.botaoCancelar}>
              <Text style={estilos.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CadastrarUsuario;

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Branco forte igual ao login
  },
  image: {
    position: "absolute",
    top: -190,
    left: -160,
    width: "150%",
    height: 500,
    resizeMode: "cover",
  },
  espacoSuperior: {
    flex: 0.85,
  },
  conteudoInferior: {
    alignItems: "center",
    paddingBottom: 60,
  },
  tituloContainer: {
    alignItems: "flex-start",
    width: "86%",
    marginBottom: 25,
  },
  texto: {
    fontSize: 50,
    fontFamily: "Raleway-Bold",
    flexShrink: 0,
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "86%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 15,
    paddingHorizontal: 14,
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    width: "86%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
  },
  inputSenha: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    paddingHorizontal: 14,
  },
  botaoOlho: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  areaInferior: {
    alignItems: "center",
    marginTop: 40,
    gap: 10,
    width: "86%",
  },
  botaoCriar: {
    backgroundColor: "#b20000",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 20,
  },
  textoCadastrar: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "NunitoSans-Light",
    textAlign: "center",
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    fontFamily: "NunitoSans-Light",
  },
  botaoGoogle: {
    backgroundColor: "#fff",
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  textoBotaoGoogle: {
    color: "#333",
    fontSize: 15,
    fontFamily: "NunitoSans-Light",
  },
  botaoCancelar: {
    marginTop: 5,
  },
  textoCancelar: {
    fontSize: 16,
    color: "#000",
    fontFamily: "NunitoSans-Light",
  },
});
