import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/(tabs)/index";

import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type NavProp = StackNavigationProp<RootStackParamList>;

export default function Cadastro() {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../assets/images/fundo.png")}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.overlay} />

          <View style={styles.container}>

            {/* TOPO */}
            <View style={styles.topo}>
              <Text style={styles.titulo}>
                NoPain <Text style={styles.corPrimaria}>NoApp</Text>
              </Text>

              <Text style={styles.subTitulo}>
                Crie sua conta e comece sua evolução
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>

              <TextInput
                placeholder="Nome"
                placeholderTextColor="#aaa"
                style={styles.input}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={styles.input}
              />

              <TextInput
                placeholder="Telefone"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
              />

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity style={styles.botaoCadastrar}>
                <Text style={styles.textoBotao}>Criar Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("LoginUser")}
              >
                <Text style={styles.linkLogin}>
                  Já tem conta? <Text style={styles.corPrimaria}>Entrar</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  topo: {
    alignItems: "center",
    marginBottom: 40,
  },

  titulo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
  },

  subTitulo: {
    fontSize: 15,
    color: "#ccc",
    marginTop: 10,
    textAlign: "center",
  },

  corPrimaria: {
    color: "#f05006",
  },

  form: {
    width: "100%",
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 10,
    color: "white",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  botaoCadastrar: {
    width: "100%",
    backgroundColor: "#f05006",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  textoBotao: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  linkLogin: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 20,
  },
});