import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { solicitarCancelamento, confirmarCancelamento } from '../services/voluntarioService';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const CancelarVoluntariado = ({ navigation }) => {
  const [etapa, setEtapa] = useState('confirmacao'); // 'confirmacao', 'codigo'
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSolicitarCodigo = () => {
    Alert.alert(
      'Cancelar Voluntariado',
      'Tem certeza que deseja cancelar seu voluntariado? Esta ação não pode ser desfeita.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const result = await solicitarCancelamento();
            setLoading(false);

            if (result.success) {
              setEtapa('codigo');
              showToast('Código enviado para seu email!', 'success');
            } else {
              showToast(result.message, 'error');
            }
          },
        },
      ]
    );
  };

  const handleConfirmarCancelamento = async (codigoParam) => {
    const codigoFinal = codigoParam || codigo;

    if (codigoFinal.length !== 6) {
      return;
    }

    setLoading(true);
    const result = await confirmarCancelamento(codigoFinal);
    setLoading(false);

    if (result.success) {
      showToast('Voluntariado cancelado com sucesso', 'success');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 2000);
    } else {
      showToast(result.message, 'error');
      setCodigo('');
    }
  };

  const handleCodigoChange = (text) => {
    setCodigo(text);
    if (text.length === 6) {
      handleConfirmarCancelamento(text);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Cancelar Voluntariado</Text>
      </View>

      <View style={styles.content}>
        {etapa === 'confirmacao' && (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="warning" size={70} color="#b20000" />
            </View>

            <Text style={styles.avisoTitulo}>Atenção!</Text>
            <Text style={styles.avisoTexto}>
              Ao cancelar seu voluntariado, você perderá acesso a:
            </Text>

            <View style={styles.listaContainer}>
              <View style={styles.itemLista}>
                <Ionicons name="close-circle" size={22} color="#b20000" />
                <Text style={styles.itemTexto}>Eventos exclusivos para voluntários</Text>
              </View>
              <View style={styles.itemLista}>
                <Ionicons name="close-circle" size={22} color="#b20000" />
                <Text style={styles.itemTexto}>Gerenciamento de atividades</Text>
              </View>
              <View style={styles.itemLista}>
                <Ionicons name="close-circle" size={22} color="#b20000" />
                <Text style={styles.itemTexto}>Badge de voluntário no perfil</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color="#b20000" />
              <Text style={styles.infoTexto}>
                Você pode se tornar voluntário novamente a qualquer momento!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.botaoCancelar, loading && styles.botaoDesabilitado]}
              onPress={handleSolicitarCodigo}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="mail" size={20} color="#fff" />
                  <Text style={styles.botaoTexto}>Enviar Código de Confirmação</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
              <Text style={styles.botaoVoltarTexto}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}

        {etapa === 'codigo' && (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-open" size={70} color="#b20000" />
            </View>

            <Text style={styles.avisoTitulo}>Digite o Código</Text>
            <Text style={styles.avisoTexto}>
              Enviamos um código de 6 dígitos para seu email. Digite-o abaixo para confirmar o cancelamento.
            </Text>

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

            <View style={styles.infoBox}>
              <Ionicons name="time" size={24} color="#b20000" />
              <Text style={styles.infoTexto}>
                O código expira em 15 minutos
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.botaoCancelar, loading && styles.botaoDesabilitado]}
              onPress={handleConfirmarCancelamento}
              disabled={loading || codigo.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoTexto}>Confirmar Cancelamento</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={handleSolicitarCodigo}
              disabled={loading}
            >
              <Text style={styles.botaoVoltarTexto}>Reenviar Código</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    backgroundColor: '#ffffff',
  },
  voltarButton: {
    marginRight: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Raleway-Bold',
  },
  content: {
    flex: 1,
    padding: 30,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  avisoTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000000',
    fontFamily: 'Raleway-Bold',
  },
  avisoTexto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#808080',
    lineHeight: 24,
    fontFamily: 'NunitoSans-Light',
    paddingHorizontal: 10,
  },
  listaContainer: {
    marginBottom: 30,
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 20,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTexto: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'NunitoSans-Light',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#b20000',
  },
  infoTexto: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'NunitoSans-Light',
    lineHeight: 20,
  },
  inputCodigo: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 20,
    fontSize: 36,
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  botaoCancelar: {
    backgroundColor: '#b20000',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Raleway-Bold',
  },
  botaoVoltar: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoVoltarTexto: {
    color: '#808080',
    fontSize: 16,
    fontFamily: 'NunitoSans-Light',
  },
});

export default CancelarVoluntariado;
