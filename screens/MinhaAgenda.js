import React, { useState, useEffect, useCallback } from "react";
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
import EventoInfoModal from "../components/EventoInfoModal";
import AtividadeInfoModal from "../components/AtividadeInfoModal";
import { useAuth } from "../context/AuthContext";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { listarParticipacoes, cancelarInscricao, confirmarPresenca } from "../services/eventosService";
import { listarInscricoes, cancelarInscricao as cancelarInscricaoAtividade } from "../services/atividadesService";

const MinhaAgenda = ({ navigation }) => {  
  const { user, isVoluntario } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventoModalVisible, setEventoModalVisible] = useState(false);
  const [atividadeModalVisible, setAtividadeModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [atividadesInscritas, setAtividadesInscritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
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
  }, [user.id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Auto-refresh a cada 30 segundos
  useAutoRefresh(carregarDados, 30000);

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAbrirEvento = (participacao) => {
    setEventoSelecionado({
      id: participacao.idEvento,
      nome: participacao.nomeEvento,
      descricao: participacao.descricaoEvento || "Sem descrição disponível",
      data: participacao.dataEvento,
      local: participacao.localEvento || "Local a definir",
      imagemUrl: participacao.imagemUrl
    });
    setEventoModalVisible(true);
  };

  const handleAbrirAtividade = (inscricao) => {
    setAtividadeSelecionada({
      id: inscricao.idCurso,
      titulo: inscricao.nomeCurso,
      descricao: inscricao.descricaoCurso || "Sem descrição disponível",
      dias: inscricao.diasCurso,
      horario: inscricao.horarioCurso,
      vagas: inscricao.vagasCurso || 0,
      imagem: inscricao.imagemCurso
    });
    setAtividadeModalVisible(true);
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
      bounces={true}
      alwaysBounceVertical={true}
      overScrollMode="always"
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
        </View>
      ) : (
        <View style={styles.eventosContainer}>
          {eventosInscritos.map((participacao) => (
            <TouchableOpacity 
              key={participacao.id} 
              style={styles.eventoCard}
              onPress={() => handleAbrirEvento(participacao)}
              activeOpacity={0.7}
            >
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
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCancelarInscricao(participacao.id, participacao.nomeEvento);
                  }}
                >
                  <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>

                {!participacao.confirmado && (
                  <TouchableOpacity
                    style={[styles.botaoAcao, styles.botaoConfirmar]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleConfirmarPresenca(participacao.id, participacao.nomeEvento);
                    }}
                  >
                    <Text style={styles.textoBotaoConfirmar}>Confirmar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão Outros Eventos */}
      <View style={styles.botaoSingleContainer}>
        <TouchableOpacity
          style={styles.botaoAgendaSingle}
          onPress={() => navigation.navigate("VerMais")}
        >
          <Text style={styles.textoAgenda}>Outros eventos</Text>
        </TouchableOpacity>
      </View>

      {/* ATIVIDADES */}
      <Text style={styles.sectionTitle}>Atividades</Text>
      
      {atividadesInscritas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não está inscrito em nenhuma atividade</Text>
        </View>
      ) : (
        <View style={styles.eventosContainer}>
          {atividadesInscritas.map((inscricao) => (
            <TouchableOpacity 
              key={inscricao.id} 
              style={styles.eventoCard}
              onPress={() => handleAbrirAtividade(inscricao)}
              activeOpacity={0.7}
            >
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
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCancelarInscricaoAtividade(inscricao.id, inscricao.nomeCurso);
                  }}
                >
                  <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão Outras Atividades */}
      <View style={styles.botaoSingleContainer}>
        <TouchableOpacity
          style={styles.botaoAgendaSingle}
          onPress={() => navigation.navigate("Atividades")}
        >
          <Text style={styles.textoAgenda}>Outras atividades</Text>
        </TouchableOpacity>
      </View>

      {/* Espaçamento final */}
      <View style={{ height: 80 }} />

      <MenuModal visible={isModalVisible} onClose={toggleModal} />
      
      <EventoInfoModal
        visible={eventoModalVisible}
        evento={eventoSelecionado}
        onClose={() => setEventoModalVisible(false)}
      />

      <AtividadeInfoModal
        visible={atividadeModalVisible}
        atividade={atividadeSelecionada}
        onClose={() => setAtividadeModalVisible(false)}
      />
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
    color: "#000000",
  },
  titleDois: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 21,
    fontFamily: "Raleway-Bold",
    color: "#000000",
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Raleway-Bold",
    color: "#000000",
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 15,
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
  botaoAgendaSingle: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    height: 40,
    borderRadius: 20,
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
  botaoSingleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  }
});


