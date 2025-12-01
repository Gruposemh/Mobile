import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const ModalEmDesenvolvimento = ({ visible, onClose, titulo, mensagem }) => {
  const [copiado, setCopiado] = useState(false);
  const tituloFinal = titulo || "Doe via PIX";
  const mensagemFinal = mensagem || "Sua contribuição faz a diferença";
  const pixCode = "00020126330014BR.GOV.BCB.PIX0111478329968465204000053039865802BR5924Thiago Campos de Resende6009SAO PAULO62140510x0SiJfuUAP6304B6F3";
  
  const copiarPixCode = async () => {
    try {
      await Clipboard.setStringAsync(pixCode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o código PIX');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="gift" size={32} color="#fff" />
            </View>
            <Text style={styles.title}>{tituloFinal}</Text>
            <Text style={styles.subtitle}>{mensagemFinal}</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            
            {/* QR Code */}
            {!titulo && (
              <>
                <Text style={styles.instruction}>Escaneie o QR Code com seu app de pagamento</Text>
                
                <View style={styles.qrcodeWrapper}>
                  <Image 
                    source={require('../assets/images/qrcode_pix.png')}
                    style={styles.qrcode}
                    resizeMode="cover"
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.copyButton, copiado && styles.copyButtonCopied]}
                  onPress={copiarPixCode}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={copiado ? "checkmark-circle" : "copy"} 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.copyButtonText}>
                    {copiado ? "Chave Copiada!" : "Copiar Chave PIX"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              <Text style={styles.footerBold}>Voluntários Pro Bem</Text> • Fazendo o bem, fazendo a diferença
            </Text>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '92%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    backgroundColor: '#B20000',
    paddingTop: 35,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Light',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  instruction: {
    fontSize: 13,
    fontFamily: 'NunitoSans-Light',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  qrcodeWrapper: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    height: 300,
    overflow: 'hidden',
  },
  qrcode: {
    width: 600,
    height: 600,
  },
  copyButton: {
    backgroundColor: '#B20000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#B20000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 5,
  },
  copyButtonCopied: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Raleway-Bold',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerBold: {
    fontWeight: '600',
    color: '#495057',
  },
});

export default ModalEmDesenvolvimento;
