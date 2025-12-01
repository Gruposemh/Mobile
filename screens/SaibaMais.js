import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MenuModal from "../components/Menu";
import ModalEmDesenvolvimento from "../components/ModalEmDesenvolvimento";
import { useAuth } from "../context/AuthContext"; 

const SaibaMais = ({ navigation }) => { 
  const { isVoluntario } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalDoacaoOpen, setModalDoacaoOpen] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDoacaoDinheiro = () => {
    setModalDoacaoOpen(true);
  }; 

  const handleDoacaoMateriais = () => {
    setModalDoacaoOpen(true);
  };

  const handleEventos = () => {
    navigation.navigate("VerMais");
  };

return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={true}
      alwaysBounceVertical={true}
      overScrollMode="always"
    >
 
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
                        <Image
                          source={require("../assets/images/Menu.png")}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
       <View style= {styles.headerMeio}>
         <Image
            source={require("../assets/images/logoOng.png")}
            style={styles.logo}
          />
          <Text style = { styles.titulo}>Voluntários Pro Bem</Text>
       </View>
         <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Image
            source={require("../assets/images/User.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
           
      </View>
       <View style={styles.linha} />

      <View style= {styles.conteudo}>
         <Image
            source={require("../assets/images/saibaMais.png")}
            style={styles.foto}
            fadeDuration={0}
            resizeMode="cover"
          />

          <View>
            <Text style={styles.texto}>
              A <Text style={{ color: '#B20000' }}>ONG Voluntários Pro Bem</Text> sobrevive graças às doações recebidas. Todas as nossas ações, eventos e campanhas são realizadas por meio dos recursos doados, para que esses projetos possam continuar acontecendo e, assim, tanto a comunidade quanto o bairro possam ser transformados.
              {'\n\n'}
              Por isso, contamos com a sua ajuda. Colabore para um mundo melhor.
              {'\n\n'}
              Você pode nos ajudar de várias formas! É possível fazer uma doação mensal de qualquer valor, ou contribuir com doações avulsas. Também aceitamos móveis, roupas e outros itens em bom estado. Além disso, você pode ser voluntário e participar dos nossos eventos.
              {'\n\n'}
              Toda ajuda faz a diferença! 💛
            </Text>
          </View>
           <View style={styles.doacoes}>
                       <TouchableOpacity onPress={handleDoacaoDinheiro}>
                                 <Image
                                   source={require("../assets/images/Component 24.png")}
                                   style={styles.doar}
                                   resizeMode="contain"
                                 />
                               </TouchableOpacity>
                   <TouchableOpacity onPress={handleDoacaoMateriais}>
                     <Image
                        source={require('../assets/images/Component 25.png')}
                            style={styles.doar}
                            resizeMode="contain"
                           />
                           </TouchableOpacity>
                           
                   {!isVoluntario && (
                     <TouchableOpacity onPress={handleEventos}>
                       <Image
                          source={require('../assets/images/Component 26.png')}
                              style={styles.ultima}
                              resizeMode="contain"
                             />
                             </TouchableOpacity>
                   )}
                 </View>
      </View>
         <MenuModal visible={isModalVisible} onClose={toggleModal} />
         <ModalEmDesenvolvimento visible={modalDoacaoOpen} onClose={() => setModalDoacaoOpen(false)} />
       </ScrollView>
       

        );
};

       export default SaibaMais;
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
 headerMeio:{
     flexDirection: "row",
    justifyContent: "space-between",
     alignItems: "center",
 },

 titulo:{
    fontSize: 20,
    color: "#000000",
 },

 logo:{
    width: 46,
    height: 53
 },
   linha: {
    marginTop: 15, 
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
  },
  conteudo: {
    alignItems: 'center',
  },
   foto: {
    marginTop: 46, 
    height: 184,
    width : 302,
    
  },

  texto: {
    fontSize: 18,
    fontFamily: 'NunitoSans-Light', 
    marginHorizontal: 25,
    marginVertical: 30,
    lineHeight: 26,
    textAlign: 'justify',
    color: "#000000",
  },
    doar: {
    marginVertical: 7, 
    height: 176,
    width : 392,
    
  },
    ultima: {
    marginVertical: 7, 
    height: 176,
    width : 392,
    marginBottom: 100
    
  },

});


