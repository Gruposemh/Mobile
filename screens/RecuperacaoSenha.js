import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet, Image, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestPasswordReset, resetPassword } from '../services/authService';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const RecuperacaoSenha = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [etapa, setEtapa] = useState('email'); // 'email', 'codigo', 'senha'
  const [loading, setLoading] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleSolicitarCodigo = async () => {
    if (!email || !email.includes('@')) { 
      showToast("Por favor, insira um email válido.", "error");
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      showToast("Código enviado! Verifique seu email.", "success");
      setTimeout(() => setEtapa('codigo'), 1000);
    } else {
      showToast(result.message, "error");
    }
  };

  const handleVerificarCodigo = (codigoParam) => {
    const codigoFinal = codigoParam || codigo;
    
    if (codigoFinal.length !== 6) {
      return;
    }
    setEtapa('senha');
  };

  const handleCodigoChange = (text) => {
    setCodigo(text);
    // Avançar automaticamente quando atingir 6 dígitos
    if (text.length === 6) {
      handleVerificarCodigo(text);
    }
  };

  const handleRedefinirSenha = async () => {
    if (!novaSenha || novaSenha.length < 6) {
      showToast("A senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, codigo, novaSenha);
    setLoading(false);

    if (result.success) {
      showToast("Senha alterada com sucesso!", "success");
      setTimeout(() => navigation.navigate("Login"), 1500);
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          <Image
            source={require('../assets/images/fundo3.png')}
            style={styles.fundo3}
            resizeMode="contain"
          />

          <Image
            source={require('../assets/images/logoOngCirculo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>Recuperação de senha</Text>
          
          {etapa === 'email' && (
            <>
              <Text style={styles.subtitulo}>Digite seu email para receber o código</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity 
                style={styles.botaoProximo} 
                onPress={handleSolicitarCodigo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoProximo}>Enviar Código</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {etapa === 'codigo' && (
            <>
              <Text style={styles.subtitulo}>Digite o código de 6 dígitos enviado para {email}</Text>

              <TextInput
                style={styles.inputCodigo}
                placeholder="000000"
                placeholderTextColor="#aaa"
                value={codigo}
                onChangeText={handleCodigoChange}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity 
                style={styles.botaoProximo} 
                onPress={handleVerificarCodigo}
              >
                <Text style={styles.textoProximo}>Próximo</Text>
              </TouchableOpacity>
            </>
          )}

          {etapa === 'senha' && (
            <>
              <Text style={styles.subtitulo}>Digite sua nova senha</Text>

              <View style={styles.inputSenhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Nova senha"
                  placeholderTextColor="#aaa"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry={!mostrarNovaSenha}
                />
                <TouchableOpacity 
                  style={styles.botaoOlho}
                  onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  <Ionicons 
                    name={mostrarNovaSenha ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSenhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#aaa"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarConfirmarSenha}
                />
                <TouchableOpacity 
                  style={styles.botaoOlho}
                  onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                >
                  <Ionicons 
                    name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.botaoProximo} 
                onPress={handleRedefinirSenha}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoProximo}>Redefinir Senha</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Botão de Cancelar */}
          <TouchableOpacity onPress={handleCancelar}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  fundo3: {
    position: 'absolute',
    width: 605,
    height: 400,
    right: -300,
    top: -100,
  },
  logo: {
    width: 155,
    height: 130,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Raleway-Bold',
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#000000ff',
    fontFamily: 'NunitoSans-Light',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "85%",
    height: 48,
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
    marginBottom: 20,
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    width: "85%",
    height: 48,
    borderRadius: 10,
    marginBottom: 20,
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
  inputCodigo: {
    backgroundColor: "#f1f1f1",
    width: "70%",
    height: 60,
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 20,
  },
  botaoProximo: {
    backgroundColor: '#b20000',
    paddingVertical: 18,
    width: "85%",
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoProximo: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'NunitoSans-Light',
  },
  textoCancelar: {
    fontSize: 16,
    color: "#000000ff",
    fontFamily: 'NunitoSans-Light',
    marginTop: 10,
  },
});

export default RecuperacaoSenha;
