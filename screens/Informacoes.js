import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from "react-native";  
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { verificarVoluntario } from "../services/voluntarioService";

const Informacoes = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [voluntarioInfo, setVoluntarioInfo] = useState(null);

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

  const formatarTelefone = (telefone) => {
    if (!telefone) return "Não informado";
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#b20000" />
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
            <Ionicons name="arrow-back" size={28} color="#000000ff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Informações Pessoais</Text>
        </View>

        <View style={styles.linha} />

        {/* Conteúdo de Informações Pessoais */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoTexto}>{user?.nome || "Não informado"}</Text>
          </View>

          <View style={styles.linhaInfo} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoTexto}>{user?.email || "Não informado"}</Text>
          </View>

          {/* Informações adicionais apenas para voluntários aprovados */}
          {voluntarioInfo && voluntarioInfo.status === 'APROVADO' && (
            <>
              <View style={styles.linhaInfo} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>CPF</Text>
                <Text style={styles.infoTexto}>{voluntarioInfo.cpf || "Não informado"}</Text>
              </View>

              <View style={styles.linhaInfo} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoTexto}>{formatarTelefone(voluntarioInfo.telefone)}</Text>
              </View>

              <View style={styles.linhaInfo} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoTexto}>{voluntarioInfo.endereco || "Não informado"}</Text>
              </View>
            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default Informacoes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  voltar: {
    position: "absolute",
    left: 0,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff",
  },
  linha: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
    width: "100%",
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Raleway-Bold",
    color: "#666",
    marginBottom: 6,
  },
  infoTexto: {
    fontSize: 16,
    fontFamily: "NunitoSans-Light",
    color: "#000",
  },
  linhaInfo: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },

});
