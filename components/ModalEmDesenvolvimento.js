import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalEmDesenvolvimento = ({ visible, onClose, titulo, mensagem }) => {
  const tituloFinal = titulo || "Sistema de Doações\nem Desenvolvimento";
  const mensagemFinal = mensagem || "Estamos trabalhando para trazer a você uma experiência completa e segura de doação!";
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header com gradiente */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="construct-outline" size={44} color="#B20000" />
            </View>
            <Text style={styles.title}>{tituloFinal}</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.message}>
              {mensagemFinal}
            </Text>
            
            {/* Features - só mostra se não for chat */}
            {!titulo && (
              <>
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIconWrapper}>
                      <Ionicons name="heart" size={20} color="#B20000" />
                    </View>
                    <Text style={styles.featureText}>Doações únicas ou mensais</Text>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={styles.featureIconWrapper}>
                      <Ionicons name="card" size={20} color="#B20000" />
                    </View>
                    <Text style={styles.featureText}>Múltiplas formas de pagamento</Text>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={styles.featureIconWrapper}>
                      <Ionicons name="shield-checkmark" size={20} color="#B20000" />
                    </View>
                    <Text style={styles.featureText}>Transações 100% seguras</Text>
                  </View>
                </View>

                <Text style={styles.submessage}>
                  Enquanto isso, você pode se tornar um voluntário e ajudar de outras formas!
                </Text>
              </>
            )}
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#B20000',
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
  },
  message: {
    fontSize: 14.5,
    fontFamily: 'NunitoSans-Light',
    color: '#333',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 21,
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 9,
    borderLeftWidth: 3.5,
    borderLeftColor: '#B20000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIconWrapper: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 13.5,
    fontFamily: 'NunitoSans-Light',
    color: '#495057',
    flex: 1,
    fontWeight: '500',
  },
  submessage: {
    fontSize: 12,
    fontFamily: 'NunitoSans-Light',
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#B20000',
    marginHorizontal: 22,
    marginBottom: 22,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#B20000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
  },
});

export default ModalEmDesenvolvimento;
