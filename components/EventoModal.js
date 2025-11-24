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

const EventoModal = ({ visible, evento, onClose, onInscrever, isVoluntario }) => {
  const [loading, setLoading] = useState(false);
  
  if (!evento) return null;

  const handleInscrever = async () => {
    setLoading(true);
    try {
      await onInscrever();
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
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
            {evento.imagemUrl && (
              <Image
                source={{ uri: evento.imagemUrl }}
                style={styles.imagem}
                resizeMode="cover"
              />
            )}
            
            <Text style={styles.titulo}>{evento.nome}</Text>
            
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.texto}>{evento.descricao}</Text>
            
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.texto}>{formatarData(evento.data)}</Text>
            
            <Text style={styles.label}>Local:</Text>
            <Text style={styles.texto}>{evento.local}</Text>

            {isVoluntario && (
              <TouchableOpacity 
                style={[styles.botaoInscrever, loading && styles.botaoDesabilitado]} 
                onPress={handleInscrever}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotao}>Confirmar Presença</Text>
                )}
              </TouchableOpacity>
            )}

            {!isVoluntario && (
              <Text style={styles.avisoVoluntario}>
                Apenas voluntários podem se inscrever em eventos
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
  },
  label: {
    fontSize: 16,
    fontFamily: "Raleway-Bold",
    marginTop: 15,
    marginBottom: 5,
  },
  texto: {
    fontSize: 16,
    fontFamily: "NunitoSans-Light",
  },
  botaoInscrever: {
    backgroundColor: "#b20000",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  botaoDesabilitado: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NunitoSans-Light",
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
  },
});

export default EventoModal;
