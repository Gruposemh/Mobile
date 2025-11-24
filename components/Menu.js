import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ModalEmDesenvolvimento from "./ModalEmDesenvolvimento";

export default function Menu({ visible, onClose }) {
  const navigation = useNavigation();
  const [modalDevOpen, setModalDevOpen] = useState(false);

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

  const handleLogout = () => {
    console.log("🚪 Fazendo logout e voltando para Login");
    onClose();
    navigation.navigate("Login");
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>

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

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair da conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <ModalEmDesenvolvimento visible={modalDevOpen} onClose={() => setModalDevOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  menu: {
    width: "70%",
    backgroundColor: "#fff",
    height: "100%",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
    position: "absolute",
    left: 0,
  },
  closeButton: { alignSelf: "flex-end", marginTop: 10 },
  menuItems: { marginTop: 20 },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ccc",
  },
  menuText: { fontSize: 16, color: "#000" },
  logoutButton: { marginTop: 50, paddingVertical: 12 },
  logoutText: { color: "red", fontWeight: "bold", fontSize: 16 },
});
