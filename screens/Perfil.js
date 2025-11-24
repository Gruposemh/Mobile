import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Notificacoes from "./Notificacoes";
import Informacoes from "./Informacoes";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { verificarVoluntario } from "../services/voluntarioService";

const Perfil = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [voluntarioInfo, setVoluntarioInfo] = useState(null);

  // Carrega os dados toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      const carregarDados = async () => {
        try {
          setLoading(true);
          if (user?.id) {
            const result = await verificarVoluntario(user.id);
            if (result.success && result.isVoluntario) {
              setVoluntarioInfo(result.data);
            }
          }
        } catch (error) {
          console.log("Erro ao carregar dados:", error);
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }, [user])
  );

  const sairDaConta = async () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          console.log('Saindo da conta...');
          await signOut();
          // Não precisa navegar, o App.js vai redirecionar automaticamente
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#000000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.voltar}
          >
            <Ionicons name="arrow-back" size={28} color="#000000ff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Perfil</Text>
        </View>

        <View style={styles.linha} />

        {/* Conteúdo principal do perfil */}
        <View style={styles.perfilContainer}>
          <Image
            source={
              user?.foto
                ? { uri: user.foto }
                : require("../assets/images/logoPerfil.png")
            }
            style={styles.foto}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.nome}>
              {user?.nome || "Nome não disponível"}
            </Text>
            <Text style={styles.email}>
              {user?.email || "Email não disponível"}
            </Text>
            
            {/* Status de voluntário */}
            {voluntarioInfo && (
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusVoluntario,
                  voluntarioInfo.status === 'APROVADO' && styles.statusAprovado,
                  voluntarioInfo.status === 'PENDENTE' && styles.statusPendente,
                  voluntarioInfo.status === 'CANCELADO' && styles.statusCancelado,
                ]}>
                  {voluntarioInfo.status === 'APROVADO' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="checkmark-circle" size={14} color="#28a745" />
                      <Text style={{ color: '#28a745', fontSize: 14, fontFamily: "NunitoSans-Light" }}>Voluntário Ativo</Text>
                    </View>
                  )}
                  {voluntarioInfo.status === 'PENDENTE' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={14} color="#856404" />
                      <Text style={{ color: '#856404', fontSize: 14, fontFamily: "NunitoSans-Light" }}>Voluntário Pendente</Text>
                    </View>
                  )}
                  {voluntarioInfo.status === 'CANCELADO' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="close-circle" size={14} color="#721c24" />
                      <Text style={{ color: '#721c24', fontSize: 14, fontFamily: "NunitoSans-Light" }}>Voluntário Cancelado</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Botão de editar */}
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => navigation.navigate("EditarPerfil")}
            >
              <Text style={styles.textoBotao}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seções adicionais */}
        <View style={styles.opcoesContainer}>
          {/* Minha Conta */}
          <Text style={[styles.tituloSecao, { marginTop: 15 }]}>
            Minha Conta
          </Text>
          <TouchableOpacity
            style={styles.opcao}
            onPress={() => {
              console.log("Navegando para Notificações!");
              navigation.navigate("Notificacoes");
            }}
          >
            <View style={styles.opcaoEsquerda}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#000000ff"
              />
              <Text style={styles.textoOpcao}>Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000ff" />
          </TouchableOpacity>

          <View style={styles.linhaOpcao} />

          <TouchableOpacity
            style={styles.opcao}
            onPress={() => {navigation.navigate("Informacoes"); 
               console.log("Navegando para Informações Pessoais!");
              
            }}
          >
            <View style={styles.opcaoEsquerda}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#000000ff"
              />
              <Text style={styles.textoOpcao}>Informações Pessoais</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000ff" />
          </TouchableOpacity>

          <View style={styles.linhaOpcao} />

          {/* Preciso de ajuda */}
          <Text style={[styles.tituloSecao, { marginTop: 50 }]}>
            Preciso de ajuda
          </Text>
          <TouchableOpacity style={styles.opcao}>
            <View style={styles.opcaoEsquerda}>
              <Ionicons
                name="chatbubbles-outline"
                size={22}
                color="#000000ff"
              />
              <Text style={styles.textoOpcao}>Conversar no chat</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000ff" />
          </TouchableOpacity>
          <View style={styles.linhaOpcao} />
        </View>
      </ScrollView>

      {/* Botão de sair fixo no final da tela */}
      <TouchableOpacity style={styles.botaoSair} onPress={sairDaConta}>
        <Text style={styles.textoSair}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "space-between",
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 10,
  },
  voltar: {
    position: "absolute",
    left: 0,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff",
    fontFamily: "Raleway-Bold",
  },
  linha: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
    width: "100%",
  },
  perfilContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginLeft: 17,
  },
  foto: {
    width: 74,
    height: 68,
    marginRight: 20,
    marginBottom: 25,
    borderRadius: 40,
  },
  infoContainer: {
    flexDirection: "column",
  },
  nome: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000ff",
    fontFamily: "NunitoSans-Light",
  },
  email: {
    fontSize: 16,
    color: "#000000ff",
    marginTop: 4,
    fontFamily: "NunitoSans-Light",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusVoluntario: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  statusAprovado: {
    color: "#28a745",
    backgroundColor: "#d4edda",
  },
  statusPendente: {
    color: "#856404",
    backgroundColor: "#fff3cd",
  },
  statusCancelado: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
  },
  botaoEditar: {
    backgroundColor: "#ffffffff",
    width: 170,
    height: 19,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b20000",
    marginTop: 15,
  },
  textoBotao: {
    color: "#b20000",
    fontSize: 13,
    fontWeight: "bold",
  },
  opcoesContainer: {
    marginTop: 10,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 10,
  },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  opcaoEsquerda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textoOpcao: {
    fontSize: 16,
    color: "#000000ff",
    fontFamily: "NunitoSans-Light",
  },
  linhaOpcao: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
  },
  botaoSair: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  textoSair: {
    color: "#b20000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
