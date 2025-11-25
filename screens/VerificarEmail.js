import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { verifyEmail } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const VerificarEmail = ({ route, navigation }) => {
  const { email } = route.params;
  const { signIn } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleVerificar = async (codigoParam) => {
    const codigoFinal = codigoParam || codigo;
    
    if (codigoFinal.length !== 6) {
      return;
    }

    setLoading(true);
    const result = await verifyEmail(email, codigoFinal);
    setLoading(false);

    if (result.success) {
      const { accessToken, refreshToken, user } = result.data;
      
      console.log('Dados recebidos da verificação:', user);
      console.log('Salvando dados após verificação');
      
      showToast("Email verificado com sucesso!", "success");
      
      // user já vem com id, nome, email, role do back-end
      await signIn(accessToken, refreshToken, user);
      
      // Não navegar manualmente - o App.js vai redirecionar automaticamente
    } else {
      showToast(result.message, "error");
      setCodigo(''); // Limpar código em caso de erro
    }
  };

  const handleCodigoChange = (text) => {
    setCodigo(text);
    // Verificar automaticamente quando atingir 6 dígitos
    if (text.length === 6) {
      handleVerificar(text);
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <Image
        source={require("../assets/images/fundo2.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.titulo}>Verificar Email</Text>
        <Text style={styles.subtexto}>
          Digite o código de 6 dígitos{"\n"}enviado para {email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor="#aaa"
          value={codigo}
          onChangeText={handleCodigoChange}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={handleVerificar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Verificar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InicioDois')}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontFamily: "Raleway-Bold",
    marginBottom: 6,
    color: "#000",
  },
  subtexto: {
    fontSize: 14,
    fontFamily: "NunitoSans-Light",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "90%",
    height: 56,
    borderRadius: 10,
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 8,
    fontFamily: "NunitoSans-Light",
  },
  botao: {
    backgroundColor: "#b20000",
    paddingVertical: 14,
    width: "90%",
    borderRadius: 20,
    marginTop: 16,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "NunitoSans-Light",
  },
  textoCancelar: {
    fontSize: 16,
    color: "#000",
    fontFamily: "NunitoSans-Light",
    marginTop: 12,
  },
});

export default VerificarEmail;
