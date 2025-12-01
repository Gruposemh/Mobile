import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AtividadeInfoModal = ({ visible, atividade, onClose }) => {
  if (!atividade) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {atividade.imagem && (
            <Image
              source={{ uri: atividade.imagem }}
              style={styles.imagem}
              resizeMode="cover"
            />
          )}
          
          <Text style={styles.titulo} numberOfLines={2}>{atividade.titulo}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#b20000" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Dias</Text>
                <Text style={styles.texto} numberOfLines={2}>{atividade.dias}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#b20000" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Horário</Text>
                <Text style={styles.texto} numberOfLines={1}>{atividade.horario}</Text>
              </View>
            </View>

            {atividade.vagas !== undefined && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={20} color="#b20000" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.label}>Vagas</Text>
                    <Text style={styles.texto} numberOfLines={1}>{atividade.vagas} disponíveis</Text>
                  </View>
                </View>
              </>
            )}

            {atividade.descricao && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="information-circle-outline" size={20} color="#b20000" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.descricao} numberOfLines={4}>{atividade.descricao}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.botaoFechar} onPress={onClose}>
            <Text style={styles.textoBotaoFechar}>Voltar</Text>
          </TouchableOpacity>
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
    borderRadius: 20,
    padding: 20,
  },
  imagem: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Raleway-Bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "Raleway-Bold",
    color: "#666",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  texto: {
    fontSize: 14,
    fontFamily: "NunitoSans-Light",
    color: "#333",
    lineHeight: 20,
  },
  descricao: {
    fontSize: 13,
    fontFamily: "NunitoSans-Light",
    color: "#555",
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  botaoFechar: {
    backgroundColor: "#b20000",
    padding: 14,
    borderRadius: 12,
  },
  textoBotaoFechar: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway-Bold",
  },
});

export default AtividadeInfoModal;
