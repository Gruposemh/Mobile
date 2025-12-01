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

  const validarSenha = (senha) => {
    const erros = [];
    
    // Mínimo 8 caracteres
    if (senha.length < 8) {
      erros.push("mínimo 8 caracteres");
    }
    
    // Letra maiúscula
    if (!/[A-Z]/.test(senha)) {
      erros.push("uma letra maiúscula");
    }
    
    // Letra minúscula
    if (!/[a-z]/.test(senha)) {
      erros.push("uma letra minúscula");
    }
    
    // Número
    if (!/[0-9]/.test(senha)) {
      erros.push("um número");
    }
    
    // Caractere especial aceito
    const especiaisAceitos = /[@!$%&*\-_+=]/;
    const especiaisInvalidos = /[#^~`"'\\\/|<>,.?:;()\[\]{}]/;
    
    if (especiaisInvalidos.test(senha)) {
      return { 
        valida: false, 
        mensagem: "Caractere especial inválido! Use apenas: @ ! $ % & * - _ + =" 
      };
    }
    
    if (!especiaisAceitos.test(senha)) {
      erros.push("um caractere especial (@ ! $ % & * - _ + =)");
    }
    
    if (erros.length > 0) {
      if (erros.length === 1) {
        return { valida: false, mensagem: `A senha precisa ter ${erros[0]}` };
      }
      return { 
        valida: false, 
        mensagem: `A senha precisa ter: ${erros.join(", ")}` 
      };
    }
    
    return { valida: true, mensagem: "" };
  };

  const handleCriar = async () => {
    if (!nome || !email || !senha) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast("Digite um email válido", "error");
      return;
    }

    const validacao = validarSenha(senha);
    if (!validacao.valida) {
      showToast(validacao.mensagem, "error");
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
      let mensagem = result.message;
      if (mensagem.toLowerCase().includes("senha") || mensagem.toLowerCase().includes("password")) {
        mensagem = "Senha inválida. Ex: Exemplo@12";
      } else if (mensagem.toLowerCase().includes("email") && mensagem.toLowerCase().includes("existe")) {
        mensagem = "Este email já está cadastrado";
      }
      showToast(mensagem, "error");
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
      const userData = { id, nome, email, role };
      await signIn(token, refreshToken, userData);
      showToast("Cadastro realizado com sucesso!", "success");
      setLoading(false);
    } else if (result.waiting) {
      setTimeout(() => setLoading(false), 3000);
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
              placeholder="Senha (ex: Exemplo@12)"
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
    backgroundColor: "#ffffff",
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
    color: "#000000",
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "86%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 15,
    paddingHorizontal: 14,
    color: "#000000",
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
    color: "#000000",
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
