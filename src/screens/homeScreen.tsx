import { useNavigation } from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import { RootStackParamList } from "../../app/(tabs)/index";

import { Dimensions,ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

type NavProp = StackNavigationProp<RootStackParamList>

export default function Index() {
  
    const navigation = useNavigation<NavProp>();

  return (

    <ImageBackground
      source={require("../../assets/images/fundo.png")}
      resizeMode="cover"
      style={styles.background}
    >

      <View style={styles.overlay}/>

        <View style={styles.container}>

        <View style={styles.topo}>
            <Text style={styles.titulo}>
            NoPain <Text style={styles.corPrimaria}>NoApp</Text>
            </Text>

            <Text style={styles.subTitulo}>
            Seja bem-vindo ao seu novo estilo de vida
            </Text>
        </View>

        <View style={styles.botoes}>
            <TouchableOpacity style={styles.btnEntrar} onPress={() => navigation.navigate("LoginUser")}>
            <Text style={styles.btnTexto}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCasdastrar} onPress={() => {navigation.navigate("RegisterUser")}} >
            <Text style={styles.btnTexto}>Cadastrar</Text>
            </TouchableOpacity>
        </View>


      </View>

    </ImageBackground>

  );
}









const styles = StyleSheet.create({

  background: {
    flex: 1,
    width:"100%",
    height: "100%",
    
  },

overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.6)",
},
 container: {
  flex: 1,
  width: "85%",
  alignSelf: "center",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 80,
},
  titulo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },

subTitulo: {
  fontSize: 16,
  color: "#ccc",
  textAlign: "center",
  marginBottom: 40,
},

  btnEntrar: {
    width: "100%",
    backgroundColor: "#f05006",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },

 btnCasdastrar: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  corPrimaria:{
    color: "#f05006",
  },
 

topo:{
  alignItems:"center"
},

botoes:{
  width:"100%"
},
});