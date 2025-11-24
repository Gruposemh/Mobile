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
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const CadastrarUsuario = ({ navigation }) => {
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
        />

        <Text style={estilos.texto}>Cadastrar {"\n"}usuário</Text>

        <TextInput
          style={estilos.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={estilos.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={estilos.inputSenhaContainer}>
          <TextInput
            style={estilos.inputSenha}
            placeholder="Senha (mínimo 6 caracteres)"
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

          <TouchableOpacity onPress={handleCancelar} style={estilos.botaoCancelar}>
            <Text style={estilos.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CadastrarUsuario;

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  texto: {
    fontSize: 50,
    fontFamily: "Raleway-Bold",
    paddingRight: 120,
    paddingHorizontal: 30,
    paddingBottom: 25,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "86%",
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 15,
    padding: 14,
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
    paddingLeft: 14,
    paddingRight: 10,
  },
  botaoOlho: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  areaInferior: {
    alignItems: "center",
    marginTop: 25,
    gap: 10,
  },
  botaoCriar: {
    backgroundColor: "#b20000",
    paddingVertical: 16,
    paddingHorizontal: 145,
    borderRadius: 20,
  },
  textoCadastrar: {
    color: "#fff",
    fontSize: 20,
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
