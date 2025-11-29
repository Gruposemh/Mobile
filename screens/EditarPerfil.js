import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { editarPerfil, uploadImagemPerfil } from '../services/usuarioService';
import { verificarVoluntario } from '../services/voluntarioService';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const EditarPerfil = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState(user?.imagemPerfil || null);
  const [isVoluntario, setIsVoluntario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    // Verificar se é voluntário APROVADO
    const result = await verificarVoluntario(user.id);
    if (result.success && result.isVoluntario && result.data.status === 'APROVADO') {
      setIsVoluntario(true);
      setTelefone(result.data.telefone || '');
      setEndereco(result.data.endereco || '');
    } else {
      setIsVoluntario(false);
    }
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showToast('Permissão negada para acessar galeria', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImagem(result.assets[0]);
    }
  };

  const uploadImagem = async (imageAsset) => {
    setLoadingImage(true);
    const uploadResult = await uploadImagemPerfil(imageAsset);
    setLoadingImage(false);

    if (uploadResult.success) {
      setImagemPerfil(uploadResult.url);
      showToast('Imagem carregada com sucesso!', 'success');
    } else {
      showToast(uploadResult.message, 'error');
    }
  };

  const handleSalvar = async () => {
    if (!nome || nome.trim() === '') {
      showToast('Nome é obrigatório', 'error');
      return;
    }

    setLoading(true);
    const dados = {
      nome: nome.trim(),
      imagemPerfil,
    };

    if (isVoluntario) {
      dados.telefone = telefone;
      dados.endereco = endereco;
    }

    const result = await editarPerfil(dados);
    setLoading(false);

    if (result.success) {
      // Atualizar dados do usuário no contexto
      await updateUser({
        ...user,
        nome: nome.trim(),
        imagemPerfil,
      });
      
      showToast('Perfil atualizado com sucesso!', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } else {
      showToast(result.message, 'error');
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
        <Text style={styles.titulo}>Editar Perfil</Text>
      </View>

      <View style={styles.imagemContainer}>
        <TouchableOpacity onPress={selecionarImagem} style={styles.imagemWrapper}>
          {loadingImage ? (
            <View style={styles.imagemPerfil}>
              <ActivityIndicator size="large" color="#b20000" />
            </View>
          ) : imagemPerfil ? (
            <Image source={{ uri: imagemPerfil }} style={styles.imagemPerfil} />
          ) : (
            <View style={styles.imagemPerfil}>
              <Ionicons name="person" size={60} color="#999" />
            </View>
          )}
          <View style={styles.editarIcone}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.imagemTexto}>Toque para alterar foto</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor="#999"
        />

        {isVoluntario && (
          <>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Seu endereço completo"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.botaoSalvar, loading && styles.botaoDesabilitado]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  voltarButton: {
    marginRight: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway-Bold',
  },
  imagemContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imagemWrapper: {
    position: 'relative',
  },
  imagemPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editarIcone: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#b20000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imagemTexto: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'NunitoSans-Light',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'NunitoSans-Light',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  botaoSalvar: {
    backgroundColor: '#b20000',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Raleway-Bold',
  },
});

export default EditarPerfil;
