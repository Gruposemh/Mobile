import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import MenuModal from "../components/Menu";
import { useAuth } from "../context/AuthContext";
import { listarParticipacoes, cancelarInscricao, confirmarPresenca } from "../services/eventosService";
import { listarInscricoes, cancelarInscricao as cancelarInscricaoAtividade } from "../services/atividadesService";

const MinhaAgenda = ({ navigation }) => {  
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [atividadesInscritas, setAtividadesInscritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const eventosResult = await listarParticipacoes(user.id);
      if (eventosResult.success) {
        setEventosInscritos(eventosResult.data);
      }

      const atividadesResult = await listarInscricoes(user.id);
      if (atividadesResult.success) {
        setAtividadesInscritas(atividadesResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCancelarInscricao = (participacaoId, nomeEvento) => {
    Alert.alert(
      "Cancelar Inscrição",
      `Deseja cancelar sua inscrição no evento "${nomeEvento}"?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            const result = await cancelarInscricao(participacaoId);
            if (result.success) {
              Alert.alert("Sucesso", "Inscrição cancelada!");
              carregarDados();
            } else {
              Alert.alert("Erro", result.message);
            }
          },
        },
      ]
    );
  };

  const handleCancelarInscricaoAtividade = (inscricaoId, nomeAtividade) => {
    Alert.alert(
      "Cancelar Inscrição",
      `Deseja cancelar sua inscrição na atividade "${nomeAtividade}"?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            const result = await cancelarInscricaoAtividade(inscricaoId);
            if (result.success) {
              Alert.alert("Sucesso", "Inscrição cancelada!");
              carregarDados();
            } else {
              Alert.alert("Erro", result.message);
            }
          },
        },
      ]
    );
  };

  const handleConfirmarPresenca = async (participacaoId, nomeEvento) => {
    Alert.alert(
      "Confirmar Presença",
      `Confirmar sua presença no evento "${nomeEvento}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            const result = await confirmarPresenca(participacaoId);
            if (result.success) {
              Alert.alert("Sucesso", "Presença confirmada!");
              carregarDados();
            } else {
              Alert.alert("Erro", result.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#b20000" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#b20000"]} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={require("../assets/images/Menu.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Image
            source={require("../assets/images/User.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Minha Agenda</Text>
        <Text style={styles.titleDois}>
          Veja aqui seus eventos e atividades!
        </Text>
      </View>

      <View style={styles.linha} />

      {/* EVENTOS */}
      <Text style={styles.sectionTitle}>Eventos</Text>
      
      {eventosInscritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não está inscrito em nenhum evento</Text>
          <TouchableOpacity
            style={styles.botaoVerEventos}
            onPress={() => navigation.navigate("VerMais")}
          >
            <Text style={styles.textoBotaoVerEventos}>Ver Eventos Disponíveis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.eventosContainer}>
          {eventosInscritos.map((participacao) => (
            <View key={participacao.id} style={styles.eventoCard}>
              <ImageBackground
                source={
                  participacao.imagemUrl 
                    ? { uri: participacao.imagemUrl } 
                    : require("../assets/images/sopa.png")
                }
                style={styles.eventoImagem}
                imageStyle={{ borderRadius: 10 }}
                defaultSource={require("../assets/images/sopa.png")}
                onError={(error) => {
                  console.log('❌ Erro ao carregar imagem:', participacao.nomeEvento);
                }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.eventoNome}>{participacao.nomeEvento}</Text>
                </View>
              </ImageBackground>

              <View style={styles.eventoInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Ionicons name="calendar-outline" size={16} color="#b20000" />
                  <Text style={styles.eventoData}>
                    {new Date(participacao.dataEvento).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons 
                    name={participacao.confirmado ? "checkmark-circle" : "time-outline"} 
                    size={16} 
                    color={participacao.confirmado ? "#28a745" : "#856404"} 
                  />
                  <Text style={styles.eventoStatus}>
                    Status: {participacao.confirmado ? 'Confirmado' : 'Pendente'}
                  </Text>
                </View>
              </View>

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoCancelar]}
                  onPress={() => handleCancelarInscricao(participacao.id, participacao.nomeEvento)}
                >
                  <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>

                {!participacao.confirmado && (
                  <TouchableOpacity
                    style={[styles.botaoAcao, styles.botaoConfirmar]}
                    onPress={() => handleConfirmarPresenca(participacao.id, participacao.nomeEvento)}
                  >
                    <Text style={styles.textoBotaoConfirmar}>Confirmar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ATIVIDADES */}
      <Text style={styles.sectionTitle}>Atividades</Text>
      
      {atividadesInscritas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não está inscrito em nenhuma atividade</Text>
          <TouchableOpacity
            style={styles.botaoVerEventos}
            onPress={() => navigation.navigate("Atividades")}
          >
            <Text style={styles.textoBotaoVerEventos}>Ver Atividades Disponíveis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.eventosContainer}>
          {atividadesInscritas.map((inscricao) => (
            <View key={inscricao.id} style={styles.eventoCard}>
              <ImageBackground
                source={
                  inscricao.imagemCurso 
                    ? { uri: inscricao.imagemCurso } 
                    : require("../assets/images/sopa.png")
                }
                style={styles.eventoImagem}
                imageStyle={{ borderRadius: 10 }}
                defaultSource={require("../assets/images/sopa.png")}
              >
                <View style={styles.overlay}>
                  <Text style={styles.eventoNome}>{inscricao.nomeCurso}</Text>
                </View>
              </ImageBackground>

              <View style={styles.eventoInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Ionicons name="calendar-outline" size={16} color="#b20000" />
                  <Text style={styles.eventoData}>{inscricao.diasCurso}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="time-outline" size={16} color="#b20000" />
                  <Text style={styles.eventoData}>{inscricao.horarioCurso}</Text>
                </View>
              </View>

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoCancelar]}
                  onPress={() => handleCancelarInscricaoAtividade(inscricao.id, inscricao.nomeCurso)}
                >
                  <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botaoAgenda}
          onPress={() => navigation.navigate("VerMais")}
        >
          <Text style={styles.textoAgenda}>Outros eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAgenda, { marginTop: 10 }]}
          onPress={() => navigation.navigate("Atividades")}
        >
          <Text style={styles.textoAgenda}>Outras atividades</Text>
        </TouchableOpacity>
      </View>

      <MenuModal visible={isModalVisible} onClose={toggleModal} />
    </ScrollView>
  );
};

       export default MinhaAgenda;
      

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    height: 100,
  },
  icon: {
    width: 30,
    height: 30,
  },
  linha: {
    marginTop: 15, 
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
  },
  content: {
    paddingBottom: 10, 
  },
  title: {
    fontSize: 15,
    marginTop: 30,
    marginLeft: 21,
    fontFamily: "NunitoSans-Light",
  },
  titleDois: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 21,
    fontFamily: "Raleway-Bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Raleway-Bold",
    color: "#333",
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 15,
    fontFamily: "Raleway-Bold",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "NunitoSans-Light",
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoVerEventos: {
    backgroundColor: "#b20000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  textoBotaoVerEventos: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway-Bold",
  },
  eventosContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventoCard: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
  },
  eventoImagem: {
    width: '100%',
    height: 170,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  eventoNome: {
    color: "#fff",
    fontSize: 19,
    fontFamily: "Raleway-Bold",
  },
  eventoInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  eventoData: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
  },
  eventoStatus: {
    fontSize: 14,
    color: "#555",
    fontFamily: "NunitoSans-Light",
  },
  botoesContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 0,
    gap: 10,
  },
  botaoAcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b20000',
  },
  botaoConfirmar: {
    backgroundColor: '#b20000',
  },
  textoBotaoCancelar: {
    color: '#b20000',
    fontSize: 14,
    fontFamily: "Raleway-Bold",
  },
  textoBotaoConfirmar: {
    color: '#fff',
    fontSize: 14,
    fontFamily: "Raleway-Bold",
  },
  botaoAgenda: {
    backgroundColor: "#fff",
    width: 150,
    height: 36,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#b20000",
  },
  textoAgenda: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
  },
  botoes: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  }
});


