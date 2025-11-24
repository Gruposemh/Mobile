import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AtividadeModal = ({ visible, atividade, onClose, onInscrever, isVoluntario }) => {
  const [loading, setLoading] = useState(false);
  
  if (!atividade) return null;

  const handleInscrever = async () => {
    setLoading(true);
    try {
      await onInscrever();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            {atividade.imagem && (
              <Image
                source={{ uri: atividade.imagem }}
                style={styles.imagem}
                resizeMode="cover"
              />
            )}
            
            <Text style={styles.titulo}>{atividade.titulo}</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#b20000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.label}>Dias:</Text>
                  <Text style={styles.texto}>{atividade.dias}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#b20000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.label}>Horário:</Text>
                  <Text style={styles.texto}>{atividade.horario}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={20} color="#b20000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.label}>Vagas:</Text>
                  <Text style={styles.texto}>{atividade.vagas} disponíveis</Text>
                </View>
              </View>
            </View>
            
            {atividade.descricao && (
              <>
                <Text style={styles.labelDescricao}>Descrição:</Text>
                <Text style={styles.descricao}>{atividade.descricao}</Text>
              </>
            )}

            {isVoluntario && (
              <TouchableOpacity 
                style={[styles.botaoInscrever, loading && styles.botaoDesabilitado]} 
                onPress={handleInscrever}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotao}>Inscrever-se</Text>
                )}
              </TouchableOpacity>
            )}

            {!isVoluntario && (
              <Text style={styles.avisoVoluntario}>
                Apenas voluntários podem se inscrever em atividades
              </Text>
            )}

            <TouchableOpacity style={styles.botaoFechar} onPress={onClose}>
              <Text style={styles.textoBotaoFechar}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 20,
    padding: 20,
  },
  imagem: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 24,
    fontFamily: "Raleway-Bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Raleway-Bold",
    color: "#666",
    marginBottom: 2,
  },
  texto: {
    fontSize: 16,
    fontFamily: "NunitoSans-Light",
    color: "#333",
  },
  labelDescricao: {
    fontSize: 16,
    fontFamily: "Raleway-Bold",
    color: "#333",
    marginBottom: 10,
  },
  descricao: {
    fontSize: 15,
    fontFamily: "NunitoSans-Light",
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "justify",
  },
  botaoInscrever: {
    backgroundColor: "#b20000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoDesabilitado: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Raleway-Bold",
  },
  botaoFechar: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotaoFechar: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NunitoSans-Light",
  },
  avisoVoluntario: {
    fontSize: 14,
    fontFamily: "NunitoSans-Light",
    color: "#b20000",
    textAlign: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fee",
    borderRadius: 8,
  },
});

export default AtividadeModal;
