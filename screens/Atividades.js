import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuModal from "../components/Menu";
import AtividadeModal from "../components/AtividadeModal";
import { useAuth } from "../context/AuthContext";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { listarAtividadesDisponiveis, inscreverAtividade } from "../services/atividadesService";

const Atividades = ({ navigation }) => {
  const { user, isVoluntario } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [atividadeModalVisible, setAtividadeModalVisible] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      // Usar o novo endpoint que já filtra as atividades disponíveis
      const atividadesResult = await listarAtividadesDisponiveis(user.id);
      if (atividadesResult.success) {
        setAtividades(atividadesResult.data);
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

  const handleAbrirAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
    setAtividadeModalVisible(true);
  };

  const handleInscrever = async () => {
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
      // Verificar se é erro de duplicação
      if (result.message && result.message.includes("já está inscrito")) {
        Alert.alert("Atenção", "Você já está inscrito nesta atividade. Verifique sua agenda.");
        setAtividadeModalVisible(false);
        // Recarregar para sincronizar
        await carregarDados();
      } else {
        Alert.alert("Erro", result.message || "Não foi possível realizar a inscrição");
      }
    }
  };

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
        <Text style={styles.title}>Faça parte!</Text>
        <Text style={styles.titleDois}>
          Transforme vidas {"\n"}através da ação.
        </Text>
        
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoAgenda}
            onPress={() => navigation.navigate("MinhaAgenda")}
          >
            <Text style={styles.textoAgenda}>Minha agenda</Text>
          </TouchableOpacity>
        </View>

        {!isVoluntario && (
          <TouchableOpacity
            style={styles.botaoVoluntario}
            onPress={() => navigation.navigate("TornarVoluntario")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="star" size={18} color="#b20000" />
              <Text style={styles.textoVoluntario}>Torne-se voluntário para participar</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.linha} />

      <View style={styles.atividadesContainer}>
        {atividades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" style={{ marginBottom: 15 }} />
            <Text style={styles.emptyText}>
              {isVoluntario 
                ? "Você já está inscrito em todas as atividades disponíveis!"
                : "Torne-se voluntário para participar das atividades"}
            </Text>
            {isVoluntario && (
              <TouchableOpacity
                style={styles.botaoMinhaAgenda}
                onPress={() => navigation.navigate("MinhaAgenda")}
              >
                <Text style={styles.textoBotaoAgenda}>Ver Minha Agenda</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          atividades.map((atividade) => (
            <TouchableOpacity
              key={atividade.id}
              style={styles.atividadeCard}
              onPress={() => handleAbrirAtividade(atividade)}
            >
              <ImageBackground
                source={
                  atividade.imagem 
                    ? { uri: atividade.imagem } 
                    : require("../assets/images/sopa.png")
                }
                style={styles.atividadeImagem}
                imageStyle={{ borderRadius: 10 }}
                defaultSource={require("../assets/images/sopa.png")}
              >
                <View style={styles.overlay}>
                  <Text style={styles.atividadeNome}>{atividade.titulo}</Text>
                </View>
              </ImageBackground>
              
              <View style={styles.atividadeInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Ionicons name="calendar-outline" size={16} color="#b20000" />
                  <Text style={styles.atividadeData}>{atividade.dias}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="time-outline" size={16} color="#b20000" />
                  <Text style={styles.atividadeHorario}>{atividade.horario}</Text>
                </View>
                {atividade.descricao && (
                  <Text style={styles.atividadeDescricao} numberOfLines={2}>
                    {atividade.descricao}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <MenuModal visible={isModalVisible} onClose={toggleModal} />
      
      <AtividadeModal
        visible={atividadeModalVisible}
        atividade={atividadeSelecionada}
        onClose={() => setAtividadeModalVisible(false)}
        onInscrever={handleInscrever}
        isVoluntario={isVoluntario}
      />
    </ScrollView>
  );
};

export default Atividades;

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
  botoes: {
    marginBottom: 10,
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
    fontFamily: "Raleway-Bold",
  },
  botaoVoluntario: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#b20000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    marginHorizontal: 20,
    alignSelf: "flex-start",
  },
  textoVoluntario: {
    fontSize: 13,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
  },
  atividadesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
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
  atividadeCard: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
  },
  atividadeImagem: {
    width: '100%',
    height: 170,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  atividadeNome: {
    color: "#fff",
    fontSize: 19,
    fontFamily: "Raleway-Bold",
  },
  atividadeInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  atividadeData: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
  },
  atividadeHorario: {
    fontSize: 14,
    color: "#b20000",
    fontFamily: "Raleway-Bold",
  },
  atividadeDescricao: {
    fontSize: 14,
    color: "#555",
    fontFamily: "NunitoSans-Light",
    lineHeight: 20,
    marginTop: 10,
  },
});
