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
const SaibaMais = ({ navigation }) => { 
  const [isModalVisible, setModalVisible] = useState(false);
       const toggleModal = () => {
      console.log(" Alternando menu. Visível?", !isModalVisible);
      setModalVisible(!isModalVisible);
    };
    const handleDoacaoDinheiro = () => {
    navigation.navigate("DoacaoDinheiro");
      }; 
      const handleDoacaoMateriais = () => {
    navigation.navigate("DoacaoMateriais");
    };
      const handleEventos = () => {
    navigation.navigate("VerMais");
    };

return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
 
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
          />

          <View >
            <Text style= {styles.texto} >A <Text style={{ color: '#B20000' }}>ONG Voluntários Pro Bem</Text> sobrevive graças às doações recebidas. Todas as nossas ações, eventos e campanhas são realizadas por meio dos recursos doados, para que esses projetos possam continuar acontecendo e, assim, tanto a comunidade quanto o bairro possam ser transformados.Por isso, contamos com a sua ajuda. Colabore para um mundo melhor.Você pode nos ajudar de várias formas! É possível fazer uma doação mensal de qualquer valor, ou contribuir com doações avulsas. Também aceitamos móveis, roupas e outros itens em bom estado. Além disso, você pode ser voluntário e participar dos nossos eventos. Toda ajuda faz a diferença! 💛</Text>
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
                           
                   <TouchableOpacity onPress={handleEventos}>
                     <Image
                        source={require('../assets/images/Component 26.png')}
                            style={styles.ultima}
                            resizeMode="contain"
                           />
                           </TouchableOpacity>
                 </View>
      </View>
         <MenuModal visible={isModalVisible} onClose={toggleModal} />
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
    fontSize: 20,
    fontFamily: 'NunitoSans-Light', 
    marginHorizontal: 55,
    marginVertical: 30,

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


