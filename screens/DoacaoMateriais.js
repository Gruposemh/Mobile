import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MenuModal from "../components/Menu";
import ModalEmDesenvolvimento from "../components/ModalEmDesenvolvimento";

const DoacaoMateriais = ({ navigation }) => {
  const [modalDevOpen, setModalDevOpen] = useState(false);

  const handleDoacaoEmDesenvolvimento = () => {
    setModalDevOpen(true);
  };
  const [valor, setValor] = useState("");
  const [tipoDoacao, setTipoDoacao] = useState("avulso");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfcnpj, setcpfcnpj] = useState("");
  const [nomeDestinatario, setNomeDestinatario] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [metodoSelecionado, setMetodoSelecionado] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };




  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={require("../assets/images/Menu.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <View style={styles.headerMeio}>
              <Image
                source={require("../assets/images/logoOng.png")}
                style={styles.logo}
              />
              <Text style={styles.titulo}>Voluntários Pro Bem</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
              <Image
                source={require("../assets/images/User.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.linha} />

          <View style={styles.parteMeio}>
            <Text style={styles.tituloDois}>
              A sua doação nos ajuda a manter os projetos e cuidar da nossa
              comunidade.
            </Text>

            <Image
              source={require("../assets/images/alimentos.png")}
              style={styles.foto}
            />
          </View>

          <View style={styles.formulario}>
            <Text style={styles.tituloTres}>Doação</Text>
            <View style={styles.linhaTexto}>
              <Text style={styles.label}>O que você deseja doar?:</Text>


              <View style={styles.inputComIcone}>

                <TextInput
                  style={styles.inputNome}
                  value={nomeCompleto}
                  onChangeText={setNomeCompleto}
                  placeholderTextColor="#aaa"
                />
              </View>

            </View>
            <Text style={styles.textoAviso}>
              Sua escolha de doação, passa por um proceso de avaliação, você receberá um aviso para prosseguir com a entrega!
            </Text>


            <Text style={styles.tituloQuatro}>Dados pessoais</Text>

            <View style={styles.linhaTexto}>
              <Text style={styles.label}>Nome completo:</Text>

              <View style={styles.inputComIcone}>
                <Image
                  source={require("../assets/images/User.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputNome}
                  value={nomeCompleto}
                  onChangeText={setNomeCompleto}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            <View style={styles.linhaTexto}>
              <Text style={styles.labelDois}>Email:</Text>

              <View style={styles.inputComIcone}>
                <Image
                  source={require("../assets/images/At sign.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputNome}
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            <View style={styles.linhaTexto}>
              <Text style={styles.labelTres}>Telefone:</Text>

              <View style={styles.inputComIcone}>
                <TextInput
                  style={styles.inputNome}
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="00 00000-0000"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            <View style={styles.linhaTexto}>
              <Text style={styles.labelQuatro}>CPF/CNPJ:</Text>

              <View style={styles.inputComIcone}>
                <TextInput
                  style={styles.inputNome}
                  value={cpfcnpj}
                  onChangeText={setcpfcnpj}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            <Text style={styles.tituloCinco}>Endereço</Text>

            {/* Nome do destinatário */}
            <View style={styles.linhaTexto}>
              <Text style={styles.label}>Destinatário:</Text>
              <View style={styles.inputComIcone}>
                <Image
                  source={require("../assets/images/User.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputNome}
                  value={nomeDestinatario}
                  onChangeText={setNomeDestinatario}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* CEP */}
            <View style={styles.linhaTexto}>
              <Text style={styles.labelDois}>CEP:</Text>
              <View style={styles.inputComIcone}>
                <TextInput
                  style={styles.inputNome}
                  value={cep}
                  onChangeText={setCep}
                  placeholder="00000-000"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* Endereço e Número */}
            <View style={[styles.linhaTexto, { gap: 10 }]}>
              <Text style={styles.labelTres}>Endereço:</Text>
              <View style={[styles.inputComIcone, { flex: 1 }]}>
                <TextInput
                  style={styles.inputNome}
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholderTextColor="#aaa"
                />
              </View>
              <Text style={styles.labelSeis}>Nº</Text>
              <View style={[styles.inputComIcone, { width: 60 }]}>
                <TextInput
                  style={styles.inputNome}
                  value={numero}
                  onChangeText={setNumero}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Complemento */}
            <View style={styles.linhaTexto}>
              <Text style={styles.labelDois}>Complemento:</Text>
              <View style={styles.inputComIcone}>
                <TextInput
                  style={styles.inputNome}
                  value={complemento}
                  onChangeText={setComplemento}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* Estado e Cidade */}
            <View style={[styles.linhaTexto, { gap: 10 }]}>
              <Text style={styles.labelPequeno}>Cidade:</Text>
              <View style={[styles.inputComIcone, { flex: 1 }]}>
                <TextInput
                  style={styles.inputNome}
                  value={cidade}
                  onChangeText={setCidade}
                  placeholderTextColor="#aaa"
                />
              </View>
              <Text style={styles.labelTres}>Estado:</Text>
              <View style={[styles.inputComIcone, { flex: 1 }]}>
                <TextInput
                  style={styles.inputNome}
                  value={estado}
                  onChangeText={setEstado}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>





          </View >
          <View style={styles.fim}>
            <TouchableOpacity onPress={handleDoacaoEmDesenvolvimento} style={styles.botaoContinuar}>
              <Text style={styles.textoContinuar}>Continuar</Text>
            </TouchableOpacity>

          </View>


        </ScrollView>
      </TouchableWithoutFeedback>
      <MenuModal visible={isModalVisible} onClose={toggleModal} />
      <ModalEmDesenvolvimento visible={modalDevOpen} onClose={() => setModalDevOpen(false)} />
    </KeyboardAvoidingView>
  );
};

export default DoacaoMateriais;

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
  headerMeio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
  },
  logo: {
    width: 46,
    height: 53,
  },
  linha: {
    marginTop: 15,
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "#b9b8b8ff",
  },
  tituloDois: {
    fontSize: 13,
    fontFamily: "Raleway-Bold",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 42,
    marginHorizontal: 12,
  },
  foto: {
    marginTop: 46,
    height: 184,
    width: 302,
  },
  parteMeio: {
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    width: 349,
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: "#000",
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
    height: "auto",
    padding: 20,
  },
  tituloTres: {
    fontSize: 20,
    color: "#707070",
    fontFamily: "Raleway-Bold",
  },
  linhaTexto: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
    flexWrap: "nowrap",
  },
  label: {
    fontSize: 13,
    color: "#000000",
  },
  labelDois: {
    fontSize: 13,
    color: "#000000",
    marginHorizontal: 31,
  },
  labelTres: {
    fontSize: 13,
    color: "#000000",
    marginHorizontal: 22,
  },
  labelQuatro: {
    fontSize: 13,
    color: "#000000",
    marginHorizontal: 18,
  },
  textoAviso: {
    fontFamily: "Raleway-Bold",
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 10,
  },
  input: {
    fontSize: 13,
    color: "#000",
    minWidth: 60,
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    gap: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(112, 112, 112, 0.5)",
    marginRight: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  radioCircleSelected: {
    backgroundColor: "#979696ff",
  },
  radioLabel: {
    fontSize: 13,
    color: "#000",
  },

  tituloQuatro: {
    fontSize: 20,
    color: "#707070",
    marginTop: 19,
    fontFamily: "Raleway-Bold",
  },
  inputComIcone: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    height: 27,
  },

  inputIcon: {
    width: 13,
    height: 14,
    marginRight: 6,
    tintColor: "#707070",
  },

  inputNome: {
    fontSize: 13,
    color: "#000",
    flex: 1,
    paddingVertical: 4,
  },
  tituloCinco: {
    fontSize: 20,
    color: "#707070",
    fontFamily: "Raleway-Bold",
    marginTop: 25,
  },
  labelPequeno: {
    fontSize: 13,
    color: "#000000",
  },
  tituloQuatro: {
    fontSize: 20,
    color: "#707070",
    fontFamily: "Raleway-Bold",
    marginTop: 30,
    marginBottom: 10,
  },
  pagamentoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#b30000',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: '75%',

  },
  pagamentoBotaoSelecionado: {
    backgroundColor: '#b30000',
  },
  pagamentoTexto: {
    color: '#b30000',
    fontSize: 16,
    fontWeight: '500',
  },
  pagamentoTextoSelecionado: {
    color: '#fff',
  },
  pagamentoRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#b30000',
    backgroundColor: '#fff',
  },
  pagamentoRadioSelecionado: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  fim: {
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 26,
    marginBottom: 90,
  },

  botaoContinuar: {
    backgroundColor: '#B20000',
    width: '80%',
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  textoContinuar: {
    color: '#F3F3F3',
    fontSize: 22,
    fontFamily: 'NunitoSans-Light',

  },

});
