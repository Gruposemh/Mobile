import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import MenuModal from "../components/Menu"; 

const Home = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    console.log(" Alternando menu. Visível?", !isModalVisible);
    setModalVisible(!isModalVisible);
  };

  const handleMinhaAgenda = () => {
    console.log(" Navegando para: minha agenda");
    navigation.navigate("MinhaAgenda");
  };

  const handleSaibaMais = () => {
    console.log(" Navegando para: SaibaMais");
    navigation.navigate("SaibaMais");
  };

  const handleVerMais = () => {
    console.log("Navegando para: VerMais");
    navigation.navigate("VerMais");
  };

  const handleDoacaoDinheiro = () => {
    console.log(" Navegando para: DoacaoDinheiro");
    navigation.navigate("DoacaoDinheiro");
  };

  const handleDoacaoMateriais = () => {
    console.log("🧭 Navegando para: DoacaoMateriais");
    navigation.navigate("DoacaoMateriais");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.title}>Bem vindo(a)!!</Text>
        <Text style={styles.titleDois}>
          Sua dedicação transforma vidas {"\n"}todos os dias.
        </Text>

        {/* BOTÕES */}
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.botaoSaiba} onPress={handleSaibaMais}>
            <Text style={styles.textoSaiba}>Saiba Mais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAgenda}
            onPress={handleMinhaAgenda}
          >
            <Text style={styles.textoAgenda}>Minha agenda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linha} />
      </View>

      {/* EVENTOS */}
      <View style={styles.eventosContainer}>
        <Text style={styles.evca}>Eventos e campanhas</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <ImageBackground
            source={require("../assets/images/sopa.png")}
            style={styles.card}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.cardText}>Entrega de sopas</Text>
            </View>
          </ImageBackground>

          <ImageBackground
            source={require("../assets/images/coleta.png")}
            style={styles.card}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.cardText}>Coleta recicláveis</Text>
            </View>
          </ImageBackground>

          <ImageBackground
            source={require("../assets/images/sopa.png")}
            style={styles.card}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.cardText}>Entrega de sopas</Text>
            </View>
          </ImageBackground>
        </ScrollView>

        <TouchableOpacity style={styles.botaoVerMais} onPress={handleVerMais}>
          <Text style={styles.textoVermais}>Ver mais...</Text>
        </TouchableOpacity>

        {/* DOAÇÕES */}
        <Text style={styles.evca}>Faça uma doação</Text>
        <View style={styles.doacoes}>
          <TouchableOpacity onPress={handleDoacaoDinheiro}>
            <Image
              source={require("../assets/images/Component 24.png")}
              style={styles.foto1}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDoacaoMateriais}>
            <Image
              source={require("../assets/images/Component 25.png")}
              style={styles.foto}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* MENU MODAL */}
      <MenuModal visible={isModalVisible} onClose={toggleModal} />
    </ScrollView>
  );
};

export default Home;

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
  content: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 15,
    marginTop: 30,
    marginLeft: 21,
    fontFamily: "NunitoSans-Light",
  },
  titleDois: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 21,
    fontFamily: "Raleway-Bold",
  },
  botoes: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  botaoSaiba: {
    backgroundColor: "#B20000",
    width: 118,
    height: 36,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSaiba: {
    fontSize: 14,
    color: "white",
  },
  botaoAgenda: {
    backgroundColor: "#fff",
    width: 118,
    height: 36,
    marginLeft: 17,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#b20000",
  },
  textoAgenda: {
    fontSize: 14,
    color: "#b20000",
  },
  linha: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
  },
  eventosContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  evca: {
    marginLeft: 11,
    fontFamily: "NunitoSans-Light",
    fontSize: 20,
    marginBottom: 17,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: 180,
    height: 200,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "NunitoSans-Light",
  },
  botaoVerMais: {
    marginTop: 15,
    alignSelf: "flex-end",
    marginRight: 15,
  },
  textoVermais: {
    fontSize: 15,
    color: "#b20000",
    fontFamily: "NunitoSans-Light",
    textDecorationLine: "underline",
  },
  doacoes: {
    justifyContent: "center",
    alignItems: "center",
  },
  foto: {
    marginTop: 20,
    marginBottom: 100,
  },
});
