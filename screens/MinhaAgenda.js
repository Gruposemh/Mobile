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
const MinhaAgenda = ({ navigation }) => {  
    const [isModalVisible, setModalVisible] = useState(false);
     const toggleModal = () => {
    console.log(" Alternando menu. Visível?", !isModalVisible);
    setModalVisible(!isModalVisible);
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
      
         <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Image
            source={require("../assets/images/User.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
           
      </View>
         <View style={styles.content}>
                <Text style={styles.title}>Não perca a data!!!</Text>
                <Text style={styles.titleDois}>
                  Veja aqui os eventos que você se inscreveu !
                </Text>
                  
                        </View>
       <View style={styles.linha} />
       <View style={styles.botoes}>
                          <TouchableOpacity
                            style={styles.botaoAgenda}
                            onPress={() => console.log("Minha agenda clicada")}
                          >
                            <Text style={styles.textoAgenda}>Outros eventos</Text>
                          </TouchableOpacity>
                        </View>

          
        <MenuModal visible={isModalVisible} onClose={toggleModal} />
       </ScrollView>
       
    
        );
};

       export default MinhaAgenda;
      

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

   linha: {
    marginTop: 15, 
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
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
    fontFamily: "Raleway-Bold",
  },

  botoes:{
    marginLeft: "50%",
    marginTop:50,
  }


});


