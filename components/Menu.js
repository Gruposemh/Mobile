import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import ModalEmDesenvolvimento from "./ModalEmDesenvolvimento";

export default function Menu({ visible, onClose }) {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [modalDevOpen, setModalDevOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const handleNavigate = (route) => {
    console.log("🧭 Tentando navegar para:", route);
    try {
      onClose();
      navigation.navigate(route);
    } catch (err) {
      console.error("Erro ao navegar:", err);
    }
  };

  const handleDoarClick = () => {
    onClose();
    setTimeout(() => {
      setModalDevOpen(true);
    }, 300);
  };

  const handleAbrirSite = async () => {
    const url = "https://front-tcc2.vercel.app/";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        onClose();
      } else {
        Alert.alert("Erro", "Não foi possível abrir o site");
      }
    } catch (error) {
      console.error("Erro ao abrir site:", error);
      Alert.alert("Erro", "Não foi possível abrir o site");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            console.log("🚪 Fazendo logout...");
            onClose();
            await signOut();
            console.log("✅ Logout concluído");
          }
        }
      ]
    );
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.menu}>
            {/* Área segura superior para o botão X */}
            <View style={[styles.safeAreaTop, { paddingTop: insets.top }]}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={30} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo do menu */}
            <View style={styles.menuContent}>
              <View style={styles.menuItems}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("Home")}>
                  <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("SaibaMais")}>
                  <Text style={styles.menuText}>Sobre a ONG</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleDoarClick}>
                  <Text style={styles.menuText}>Quero doar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("MinhaAgenda")}>
                  <Text style={styles.menuText}>Minha agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("VerMais")}>
                  <Text style={styles.menuText}>Eventos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("Atividades")}>
                  <Text style={styles.menuText}>Atividades</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleAbrirSite}>
                  <View style={styles.menuItemComIcone}>
                    <Text style={styles.menuText}>Nosso Site</Text>
                    <Ionicons name="open-outline" size={18} color="#b20000" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Área segura inferior */}
            <View style={{ paddingBottom: insets.bottom }} />
          </View>
        </View>
      </Modal>
      
      <ModalEmDesenvolvimento visible={modalDevOpen} onClose={() => setModalDevOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)" 
  },
  menu: {
    width: "70%",
    backgroundColor: "#fff",
    height: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
    position: "absolute",
    left: 0,
  },
  safeAreaTop: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  closeButton: { 
    alignSelf: "flex-end", 
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItems: { 
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ccc",
  },
  menuText: { 
    fontSize: 16, 
    color: "#000",
    fontFamily: "NunitoSans-Light",
  },
  menuItemComIcone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButton: { 
    marginTop: 50, 
    paddingVertical: 12 
  },
  logoutText: { 
    color: "#b20000", 
    fontWeight: "bold", 
    fontSize: 16,
    fontFamily: "Raleway-Bold",
  },
});
