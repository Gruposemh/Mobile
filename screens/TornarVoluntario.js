import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { tornarVoluntario, verificarVoluntario } from "../services/voluntarioService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const TornarVoluntario = ({ navigation }) => {
  const { user, updateVoluntarioStatus } = useAuth();
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Verificar se já tem pedido pendente ao entrar na tela
  useEffect(() => {
    const verificarStatus = async () => {
      if (user?.id) {
        const result = await verificarVoluntario(user.id);
        if (result.success && result.isVoluntario) {
          const status = result.data.status;
          
          if (status === 'PENDENTE') {
            Alert.alert(
              "Pedido em Análise",
              "Você já possui um pedido para se tornar voluntário em análise. Aguarde a aprovação.",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          } else if (status === 'APROVADO') {
            Alert.alert(
              "Já é Voluntário",
              "Você já é um voluntário aprovado!",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          }
        }
      }
    };
    
    verificarStatus();
  }, [user, navigation]);

  const handleCpfChange = (text) => {
    const numeros = text.replace(/\D/g, '');
    let cpfFormatado = numeros;
    
    if (numeros.length >= 3) {
      cpfFormatado = numeros.slice(0, 3);
      if (numeros.length >= 4) {
        cpfFormatado += '.' + numeros.slice(3, 6);
      }
      if (numeros.length >= 7) {
        cpfFormatado += '.' + numeros.slice(6, 9);
      }
      if (numeros.length >= 10) {
        cpfFormatado += '-' + numeros.slice(9, 11);
      }
    }
    
    setCpf(cpfFormatado);
  };

  const handleTelefoneChange = (text) => {
    const numeros = text.replace(/\D/g, '');
    let telefoneFormatado = numeros;
    
    if (numeros.length >= 2) {
      telefoneFormatado = '(' + numeros.slice(0, 2);
      if (numeros.length >= 3) {
        telefoneFormatado += ') ' + numeros.slice(2, 7);
      }
      if (numeros.length >= 8) {
        telefoneFormatado += '-' + numeros.slice(7, 11);
      }
    }
    
    setTelefone(telefoneFormatado);
  };

  const handleDataChange = (text) => {
    const numeros = text.replace(/\D/g, '');
    let dataFormatada = numeros;
    
    if (numeros.length >= 2) {
      dataFormatada = numeros.slice(0, 2);
      if (numeros.length >= 3) {
        dataFormatada += '/' + numeros.slice(2, 4);
      }
      if (numeros.length >= 5) {
        dataFormatada += '/' + numeros.slice(4, 8);
      }
    }
    
    setDataNascimento(dataFormatada);
  };

  const converterDataParaISO = (dataBR) => {
    // Converte DD/MM/YYYY para YYYY-MM-DD
    const partes = dataBR.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return dataBR;
  };

  const calcularIdade = (dataNasc) => {
    const partes = dataNasc.split('/');
    const [dia, mes, ano] = partes.map(Number);
    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const handleCadastrar = async () => {
    if (!cpf || !telefone || !dataNascimento || !endereco || !descricao) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    // Validar formato da data
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
      showToast("Data de nascimento inválida. Use DD/MM/AAAA", "error");
      return;
    }

    // Log para debug
    const idade = calcularIdade(dataNascimento);
    console.log('Idade calculada:', idade, 'para data:', dataNascimento);

    const dataISO = converterDataParaISO(dataNascimento);
    console.log('Data convertida:', dataNascimento, '->', dataISO);
    
    const dados = {
      idUsuario: user.id,
      cpf: cpf.replace(/\D/g, ''), // Remove formatação
      telefone: telefone.replace(/\D/g, ''), // Remove formatação
      dataNascimento: dataISO,
      endereco,
      descricao,
    };

    console.log('Enviando dados do voluntário:', dados);

    setLoading(true);
    const result = await tornarVoluntario(dados);
    setLoading(false);

    if (result.success) {
      showToast("Solicitação enviada com sucesso!", "success");
      setTimeout(() => {
        updateVoluntarioStatus(false); // Ainda não aprovado
        navigation.goBack();
      }, 1500);
    } else {
      // Melhorar mensagem de erro
      let mensagem = result.message;
      if (mensagem.includes("CPF inválido")) {
        mensagem = "CPF inválido. Verifique o número digitado e tente novamente.";
      } else if (mensagem.includes("18 anos") || mensagem.includes("constraint")) {
        mensagem = "Você precisa ter mais de 18 anos para se tornar voluntário.";
      } else if (mensagem.includes("em análise") || mensagem.includes("PENDENTE")) {
        mensagem = "Você já possui um pedido para se tornar voluntário em análise. Aguarde a aprovação.";
      } else if (mensagem.includes("já é um voluntário")) {
        mensagem = "Você já é um voluntário aprovado.";
      }
      showToast(mensagem, "error");
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/fundo1.png")}
            style={styles.image}
          />

          <Text style={styles.texto}>Tornar-se {"\n"}Voluntário</Text>

          <TextInput
            style={styles.input}
            placeholder="CPF (000.000.000-00)"
            placeholderTextColor="#aaa"
            value={cpf}
            onChangeText={handleCpfChange}
            keyboardType="numeric"
            maxLength={14}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone (00) 00000-0000"
            placeholderTextColor="#aaa"
            value={telefone}
            onChangeText={handleTelefoneChange}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            placeholderTextColor="#aaa"
            value={dataNascimento}
            onChangeText={handleDataChange}
            keyboardType="numeric"
            maxLength={10}
          />

          <TextInput
            style={styles.input}
            placeholder="Endereço"
            placeholderTextColor="#aaa"
            value={endereco}
            onChangeText={setEndereco}
          />

          <TextInput
            style={[styles.input, styles.inputDescricao]}
            placeholder="Por que deseja ser voluntário?"
            placeholderTextColor="#aaa"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />

          <View style={styles.areaInferior}>
            <TouchableOpacity
              style={styles.botaoCriar}
              onPress={handleCadastrar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoCadastrar}>Enviar Solicitação</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.botaoCancelar}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingBottom: 40,
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
    fontSize: 45,
    fontFamily: "Raleway-Bold",
    paddingTop: 130,
    paddingRight: 80,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "86%",
    height: 48,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 15,
    padding: 14,
    color: "#000000",
  },
  inputDescricao: {
    height: 100,
    textAlignVertical: "top",
  },
  areaInferior: {
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  botaoCriar: {
    backgroundColor: "#b20000",
    paddingVertical: 19,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginTop: 25,
  },
  textoCadastrar: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "NunitoSans-Light",
  },
  botaoCancelar: {
    marginTop: 10,
  },
  textoCancelar: {
    fontSize: 16,
    color: "#000",
    fontFamily: "NunitoSans-Light",
  },
});

export default TornarVoluntario;
