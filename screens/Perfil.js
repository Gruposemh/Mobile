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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { verificarVoluntario } from "../services/voluntarioService";
import { buscarUsuario } from "../services/usuarioService";

const Perfil = ({ navigation }) => {
  const { user, signOut, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [voluntarioInfo, setVoluntarioInfo] = useState(null);
  const [imagemPerfil, setImagemPerfil] = useState(user?.imagemPerfil || null);

  const abrirWhatsApp = async () => {
    const url = "https://wa.me/5511959247968";
    try {
      // Força abrir no navegador externo que depois redireciona para o WhatsApp
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback: abre a URL da API do WhatsApp Web
        await Linking.openURL("https://api.whatsapp.com/send?phone=5511959247968");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o link");
    }
  };

  // Carrega os dados toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      const carregarDados = async () => {
        try {
          setLoading(true);
          if (user?.id) {
            // Buscar dados atualizados do usuário
            const usuarioResult = await buscarUsuario(user.id);
            if (usuarioResult.success && usuarioResult.data) {
              const dadosAtualizados = usuarioResult.data;
              if (dadosAtualizados.imagemPerfil) {
                setImagemPerfil(dadosAtualizados.imagemPerfil);
                // Atualizar no contexto também
                if (dadosAtualizados.imagemPerfil !== user.imagemPerfil) {
                  await updateUser({
                    ...user,
                    imagemPerfil: dadosAtualizados.imagemPerfil,
                  });
                }
              }
            }

            // Verificar status de voluntário
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
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={true}
        alwaysBounceVertical={true}
        overScrollMode="always"
      >
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
              imagemPerfil
                ? { uri: imagemPerfil }
                : require("../assets/images/logoPerfil.png")
            }
            style={styles.foto}
            onError={() => setImagemPerfil(null)}
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
                {voluntarioInfo.status === 'APROVADO' && (
                  <View style={styles.badgeVoluntario}>
                    <Ionicons name="star" size={12} color="#fff" />
                    <Text style={styles.textoVoluntario}>Voluntário</Text>
                  </View>
                )}
                {voluntarioInfo.status === 'PENDENTE' && (
                  <View style={styles.badgePendente}>
                    <Ionicons name="time-outline" size={12} color="#fff" />
                    <Text style={styles.textoPendente}>Em Análise</Text>
                  </View>
                )}
              </View>
            )}
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
            onPress={() => navigation.navigate("EditarPerfil")}
          >
            <View style={styles.opcaoEsquerda}>
              <Ionicons
                name="create-outline"
                size={22}
                color="#000000ff"
              />
              <Text style={styles.textoOpcao}>Editar Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.opcao}
            onPress={() => {
              navigation.navigate("Informacoes"); 
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

          {/* Voluntariado */}
          {voluntarioInfo && voluntarioInfo.status === 'APROVADO' && (
            <>
              <Text style={[styles.tituloSecao, { marginTop: 50 }]}>
                Voluntariado
              </Text>
              <TouchableOpacity
                style={styles.opcao}
                onPress={() => navigation.navigate("CancelarVoluntariado")}
              >
                <View style={styles.opcaoEsquerda}>
                  <Ionicons
                    name="close-circle-outline"
                    size={22}
                    color="#dc3545"
                  />
                  <Text style={[styles.textoOpcao, { color: '#dc3545' }]}>
                    Cancelar Voluntariado
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#dc3545" />
              </TouchableOpacity>
              <View style={styles.linhaOpcao} />
            </>
          )}

          {/* Preciso de ajuda */}
          <Text style={[styles.tituloSecao, { marginTop: 50 }]}>
            Preciso de ajuda
          </Text>
          <TouchableOpacity 
            style={styles.opcao}
            onPress={abrirWhatsApp}
          >
            <View style={styles.opcaoEsquerda}>
              <Ionicons
                name="logo-whatsapp"
                size={22}
                color="#25D366"
              />
              <Text style={styles.textoOpcao}>Conversar no WhatsApp</Text>
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
    marginTop: 10,
  },
  badgeVoluntario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b20000',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  textoVoluntario: {
    color: '#fff',
    fontSize: 11,
    fontFamily: "Raleway-Bold",
  },
  badgePendente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0ad4e',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  textoPendente: {
    color: '#fff',
    fontSize: 11,
    fontFamily: "Raleway-Bold",
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
