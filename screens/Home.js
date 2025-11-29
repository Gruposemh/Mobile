import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuModal from "../components/Menu";
import EventoModal from "../components/EventoModal";
import ModalEmDesenvolvimento from "../components/ModalEmDesenvolvimento";
import { useAuth } from "../context/AuthContext";
import { listarEventos, listarParticipacoes, inscreverEvento } from "../services/eventosService";
import { verificarVoluntario } from "../services/voluntarioService";
import { listarAtividades, listarInscricoes, inscreverAtividade } from "../services/atividadesService";
import AtividadeModal from "../components/AtividadeModal"; 

const Home = ({ navigation }) => {
  const { user, isVoluntario, updateVoluntarioStatus } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventoModalVisible, setEventoModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [atividadeModalVisible, setAtividadeModalVisible] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [atividadesInscritas, setAtividadesInscritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalDevOpen, setModalDevOpen] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Verificar se é voluntário
      const voluntarioResult = await verificarVoluntario(user.id);
      if (voluntarioResult.success) {
        updateVoluntarioStatus(voluntarioResult.isVoluntario && voluntarioResult.data?.status === 'APROVADO');
      }

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

      // Buscar atividades
      const atividadesResult = await listarAtividades();
      if (atividadesResult.success) {
        setAtividades(atividadesResult.data);
      }

      // Buscar inscrições em atividades
      const inscricoesResult = await listarInscricoes(user.id);
      if (inscricoesResult.success) {
        console.log('📚 Inscrições em atividades:', inscricoesResult.data);
        const idsInscritas = inscricoesResult.data.map(i => i.idCurso);
        console.log('📚 IDs das atividades inscritas:', idsInscritas);
        setAtividadesInscritas(idsInscritas);
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

  const handleAbrirAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
    setAtividadeModalVisible(true);
  };

  const handleInscreverAtividade = async () => {
    if (!isVoluntario) {
      Alert.alert("Atenção", "Apenas voluntários aprovados podem se inscrever em atividades");
      return;
    }

    const result = await inscreverAtividade(user.id, atividadeSelecionada.id);
    if (result.success) {
      Alert.alert("Sucesso!", "Inscrição realizada com sucesso!");
      setAtividadeModalVisible(false);
      // Recarregar dados para atualizar a lista
      await carregarDados();
    } else {
      Alert.alert("Erro", result.message);
    }
  };

  const handleMinhaAgenda = () => {
    console.log(" Navegando para: minha agenda");
    navigation.navigate("MinhaAgenda");
  };

  const handleSaibaMais = () => {
    console.log(" Navegando para: SaibaMais");
    navigation.navigate("SaibaMais");
  };

  const handleVerMais = () => {
    console.log("Navegando para: VerMais");
    navigation.navigate("VerMais");
  };

  const handleDoacaoDinheiro = () => {
    console.log("🎁 Abrindo modal de doação em desenvolvimento");
    setModalDevOpen(true);
  };

  const handleDoacaoMateriais = () => {
    console.log("🎁 Abrindo modal de doação em desenvolvimento");
    setModalDevOpen(true);
  };

  // Filtrar eventos não inscritos
  const eventosDisponiveis = eventos.filter(
    evento => !eventosInscritos.includes(evento.id)
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#b20000" />
        <Text style={{ marginTop: 10, fontFamily: "NunitoSans-Light" }}>Carregando...</Text>
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
      {/* HEADER */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.title}>Bem vindo(a), {user?.nome}!</Text>
        <Text style={styles.titleDois}>
          Sua dedicação transforma vidas {"\n"}todos os dias.
        </Text>

        {/* Botão para se tornar voluntário (se não for) */}
        {!isVoluntario && (
          <TouchableOpacity
            style={styles.botaoVoluntario}
            onPress={() => navigation.navigate("TornarVoluntario")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="star-outline" size={16} color="#b20000" />
              <Text style={styles.textoVoluntario}>Torne-se voluntário</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* BOTÕES */}
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.botaoSaiba} onPress={handleSaibaMais}>
            <Text style={styles.textoSaiba}>Saiba Mais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAgenda}
            onPress={handleMinhaAgenda}
          >
            <Text style={styles.textoAgenda}>Minha agenda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linha} />
      </View>

      {/* EVENTOS */}
      <View style={styles.eventosContainer}>
        <Text style={styles.evca}>Eventos e campanhas</Text>

        {eventosDisponiveis.length === 0 ? (
          <Text style={styles.semEventos}>
            Nenhum evento disponível no momento
          </Text>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {eventosDisponiveis.slice(0, 3).map((evento) => (
                <TouchableOpacity
                  key={evento.id}
                  onPress={() => handleAbrirEvento(evento)}
                >
                  <ImageBackground
                    source={
                      evento.imagemUrl 
                        ? { uri: evento.imagemUrl } 
                        : require("../assets/images/sopa.png")
                    }
                    style={styles.card}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                    defaultSource={require("../assets/images/sopa.png")}
                    onError={(error) => {
                      console.log('❌ Erro ao carregar imagem do evento:', evento.nome, error.nativeEvent.error);
                    }}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.cardText}>{evento.nome}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
              
              {/* Botão Ver Mais no final do carrossel */}
              <TouchableOpacity 
                style={styles.cardVerMais}
                onPress={handleVerMais}
              >
                <Ionicons name="arrow-forward-circle-outline" size={50} color="#b20000" />
                <Text style={styles.textoCardVerMais}>Ver mais</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}

        {/* ATIVIDADES */}
        <Text style={styles.evca}>Atividades</Text>

        {atividades.filter(a => !atividadesInscritas.includes(a.id)).length === 0 ? (
          <Text style={styles.semEventos}>
            Nenhuma atividade disponível no momento
          </Text>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {atividades.filter(a => !atividadesInscritas.includes(a.id)).slice(0, 3).map((atividade) => (
                <TouchableOpacity
                  key={atividade.id}
                  onPress={() => handleAbrirAtividade(atividade)}
                >
                  <ImageBackground
                    source={
                      atividade.imagem 
                        ? { uri: atividade.imagem } 
                        : require("../assets/images/sopa.png")
                    }
                    style={styles.card}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                    defaultSource={require("../assets/images/sopa.png")}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.cardText}>{atividade.titulo}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
              
              {/* Botão Ver Mais no final do carrossel */}
              <TouchableOpacity 
                style={styles.cardVerMais}
                onPress={() => navigation.navigate("Atividades")}
              >
                <Ionicons name="arrow-forward-circle-outline" size={50} color="#b20000" />
                <Text style={styles.textoCardVerMais}>Ver mais</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}

        {/* DOAÇÕES */}
        <Text style={styles.evca}>Faça uma doação</Text>
        <View style={styles.doacoes}>
          <TouchableOpacity onPress={handleDoacaoDinheiro}>
            <Image
              source={require("../assets/images/Component 24.png")}
              style={styles.foto1}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDoacaoMateriais}>
            <Image
              source={require("../assets/images/Component 25.png")}
              style={styles.foto}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* MENU MODAL */}
      <MenuModal visible={isModalVisible} onClose={toggleModal} />
      
      {/* MODAL DE EVENTO */}
      <EventoModal
        visible={eventoModalVisible}
        evento={eventoSelecionado}
        onClose={() => setEventoModalVisible(false)}
        onInscrever={handleInscrever}
        isVoluntario={isVoluntario}
      />

      {/* MODAL DE ATIVIDADE */}
      <AtividadeModal
        visible={atividadeModalVisible}
        atividade={atividadeSelecionada}
        onClose={() => setAtividadeModalVisible(false)}
        onInscrever={handleInscreverAtividade}
        isVoluntario={isVoluntario}
      />

      {/* MODAL DE DESENVOLVIMENTO */}
      <ModalEmDesenvolvimento visible={modalDevOpen} onClose={() => setModalDevOpen(false)} />
    </ScrollView>
  );
};

export default Home;

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
  botoes: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  botaoSaiba: {
    backgroundColor: "#B20000",
    width: 118,
    height: 36,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSaiba: {
    fontSize: 14,
    color: "white",
  },
  botaoAgenda: {
    backgroundColor: "#fff",
    width: 118,
    height: 36,
    marginLeft: 17,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#b20000",
  },
  textoAgenda: {
    fontSize: 14,
    color: "#b20000",
  },
  linha: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
  },
  eventosContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  evca: {
    marginLeft: 11,
    fontFamily: "NunitoSans-Light",
    fontSize: 20,
    marginBottom: 17,
    marginTop: 30,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: 190,
    height: 210,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    backgroundColor: '#fff',
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway-Bold",
    textAlign: "center",
  },
  cardVerMais: {
    width: 190,
    height: 210,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCardVerMais: {
    fontSize: 16,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
    marginTop: 10,
  },
  doacoes: {
    justifyContent: "center",
    alignItems: "center",
  },
  foto1: {
    width: 320,
    height: 180,
    marginTop: 20,
  },
  foto: {
    width: 320,
    height: 180,
    marginTop: 20,
    marginBottom: 100,
  },
  botaoVoluntario: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#b20000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    marginHorizontal: 20,
    alignSelf: "flex-start",
  },
  textoVoluntario: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: "NunitoSans-Light",
  },
  semEventos: {
    fontSize: 16,
    color: "#666",
    fontFamily: "NunitoSans-Light",
    textAlign: "center",
    marginVertical: 20,
  },
});
