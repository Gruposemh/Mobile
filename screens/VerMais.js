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
import EventoModal from "../components/EventoModal";
import { useAuth } from "../context/AuthContext";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { listarEventos, listarParticipacoes, inscreverEvento } from "../services/eventosService";

const VerMais = ({ navigation }) => {  
  const { user, isVoluntario } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventoModalVisible, setEventoModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      // Buscar eventos
      const eventosResult = await listarEventos();
      if (eventosResult.success) {
        setEventos(eventosResult.data);
      }

      // Buscar participações
      const participacoesResult = await listarParticipacoes(user.id);
      if (participacoesResult.success) {
        const idsInscritos = participacoesResult.data.map(p => p.idEvento);
        setEventosInscritos(idsInscritos);
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

  const handleAbrirEvento = (evento) => {
    setEventoSelecionado(evento);
    setEventoModalVisible(true);
  };

  const handleInscrever = async () => {
    if (!isVoluntario) {
      Alert.alert("Atenção", "Apenas voluntários aprovados podem se inscrever em eventos");
      return;
    }

    const result = await inscreverEvento(user.id, eventoSelecionado.id);
    if (result.success) {
      Alert.alert("Sucesso!", "Inscrição realizada com sucesso!");
      setEventoModalVisible(false);
      carregarDados();
    } else {
      Alert.alert("Erro", result.message);
    }
  };

  const handleMinhaAgenda = () => {
    navigation.navigate("MinhaAgenda");
  };

  // Filtrar eventos não inscritos
  const eventosDisponiveis = eventos.filter(
    evento => !eventosInscritos.includes(evento.id)
  );

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
        <Text style={styles.title}>Participe!!</Text>
        <Text style={styles.titleDois}>
          Toda ação tem {"\n"}um propósito.
        </Text>
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoAgenda}
            onPress={handleMinhaAgenda}
          >
            <Text style={styles.textoAgenda}>Minha agenda</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.linha} />

      <View style={styles.eventosContainer}>
        {eventosDisponiveis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você já está inscrito em todos os eventos disponíveis!
            </Text>
            <TouchableOpacity
              style={styles.botaoMinhaAgenda}
              onPress={handleMinhaAgenda}
            >
              <Text style={styles.textoBotaoAgenda}>Ver Minha Agenda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          eventosDisponiveis.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={styles.eventoCard}
              onPress={() => handleAbrirEvento(evento)}
            >
              <ImageBackground
                source={
                  evento.imagemUrl 
                    ? { uri: evento.imagemUrl } 
                    : require("../assets/images/sopa.png")
                }
                style={styles.eventoImagem}
                imageStyle={{ borderRadius: 10 }}
                resizeMode="cover"
                defaultSource={require("../assets/images/sopa.png")}
                onError={(error) => {
                  console.log('❌ Erro ao carregar imagem:', evento.nome);
                }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.eventoNome}>{evento.nome}</Text>
                </View>
              </ImageBackground>
              <View style={styles.eventoInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Ionicons name="calendar-outline" size={16} color="#b20000" />
                  <Text style={styles.eventoData}>
                    {new Date(evento.data).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text style={styles.eventoDescricao} numberOfLines={2}>
                  {evento.descricao}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <MenuModal visible={isModalVisible} onClose={toggleModal} />
      
      <EventoModal
        visible={eventoModalVisible}
        evento={eventoSelecionado}
        onClose={() => setEventoModalVisible(false)}
        onInscrever={handleInscrever}
        isVoluntario={isVoluntario}
      />
    </ScrollView>
  );
};

export default VerMais;

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
  botaoAgenda: {
    backgroundColor: "#B20000",
    width: 118,
    height: 36,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 20,
  },
  textoAgenda: {
    fontSize: 14,
    color: "white",
  },
  botoes: {
    marginBottom: 10,
  },
  eventosContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
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
  eventoDescricao: {
    fontSize: 14,
    color: "#555",
    fontFamily: "NunitoSans-Light",
    lineHeight: 20,
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
    paddingHorizontal: 20,
  },
  botaoMinhaAgenda: {
    backgroundColor: "#b20000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  textoBotaoAgenda: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway-Bold",
  },
});
