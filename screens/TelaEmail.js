import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet, Image, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { requestOTP, loginOTP } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const TelaEmail = ({ navigation }) => {  
  const { signIn } = useAuth();
  const [email, setEmail] = useState(''); 
  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState('email'); // 'email' ou 'codigo'
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCancelar = () => {
    if (etapa === 'codigo') {
      // Se estiver na etapa de código, voltar para a tela inicial
      navigation.navigate('InicioDois');
    } else {
      // Se estiver na etapa de email, apenas voltar
      navigation.goBack();
    }
  };

  const handleSolicitarCodigo = async () => {
    if (!email || !email.includes('@')) {
      showToast("Por favor, insira um email válido.", "error");
      return;
    }

    setLoading(true);
    const result = await requestOTP(email);
    setLoading(false);

    if (result.success) {
      setEtapa('codigo');
      showToast("Código enviado! Verifique seu email.", "success");
    } else {
      showToast(result.message, "error");
    }
  };

  const handleLoginComCodigo = async (codigoParam) => {
    const codigoFinal = codigoParam || codigo;
    
    if (codigoFinal.length !== 6) {
      return;
    }

    setLoading(true);
    const result = await loginOTP(email, codigoFinal);
    setLoading(false);

    if (result.success) {
      const { token, refreshToken, email: userEmail, role, id, nome } = result.data;
      
      const userData = {
        id: id,
        nome: nome,
        email: userEmail,
        role: role,
      };
      
      await signIn(token, refreshToken, userData);
      showToast("Login realizado com sucesso!", "success");
    } else {
      showToast(result.message, "error");
      setCodigo(''); // Limpar código em caso de erro
    }
  };

  const handleCodigoChange = (text) => {
    setCodigo(text);
    // Verificar automaticamente quando atingir 6 dígitos
    if (text.length === 6) {
      handleLoginComCodigo(text);
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

          <Text style={styles.titulo}>Login com Código</Text>

          {etapa === 'email' && (
            <>
              <Text style={styles.subtitulo}>Digite seu email para receber o código</Text>

              <TextInput
                style={styles.inputEmail}
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
                editable={!loading}
              />

              <TouchableOpacity 
                style={styles.botaoProximo} 
                onPress={handleLoginComCodigo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoProximo}>Entrar</Text>
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
  inputEmail: {
    backgroundColor: "#f1f1f1",
    width: "85%",
    height: 48,
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
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
  textoCancelar: {
    fontSize: 16,
    color: "#000000ff",
    fontFamily: 'NunitoSans-Light',
    marginTop: 10,
  },
});

export default TelaEmail;
