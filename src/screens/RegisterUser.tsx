import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/(tabs)/index";

import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { auth, database } from "@/services/connectionFirebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref } from "firebase/database";
import { useState } from "react";

type NavProp = StackNavigationProp<RootStackParamList>;

export default function RegisterUser() {
  const navigation = useNavigation<NavProp>();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<any>({});

  // 🔐 REGEX SENHA FORTE
  const senhaRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{6,}$/;

  // 📱 FORMATAR TELEFONE
  function formatarTelefone(text: string) {
    const numeros = text.replace(/\D/g, "");

    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 11)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  // ✅ VALIDAÇÃO COMPLETA
  function validarCampos() {
    const novosErros: any = {};

    if (!nome.trim()) novosErros.nome = "Digite seu nome";

    if (!email.trim()) {
      novosErros.email = "Digite seu email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = "Email inválido";
    }

    const numeros = telefone.replace(/\D/g, "");
    if (!numeros) {
      novosErros.telefone = "Digite seu telefone";
    } else if (numeros.length < 11) {
      novosErros.telefone = "Telefone incompleto";
    }

    if (!senha) {
      novosErros.senha = "Digite sua senha";
    } else if (!senhaRegex.test(senha)) {
      novosErros.senha =
        "Use 6+ caracteres com maiúscula, número e símbolo";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // 🚀 CADASTRO
  async function register() {
    if (!validarCampos()) return;

    try {
      const userCredencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const user = userCredencial.user;

      if (user) {
        await set(ref(database, "usuario/" + user.uid), {
          nome,
          telefone,
          email,
        });
      }

      Alert.alert("Sucesso", "Conta criada!");
      navigation.navigate("LoginUser");

    } catch (error: any) {
      const novosErros: any = {};

      if (error.code === "auth/email-already-in-use") {
        novosErros.email = "Este email já está cadastrado";
      } else if (error.code === "auth/invalid-email") {
        novosErros.email = "Email inválido";
      } else if (error.code === "auth/weak-password") {
        novosErros.senha = "Senha muito fraca";
      } else {
        Alert.alert("Erro", "Erro ao cadastrar");
      }

      setErros(novosErros);
    }
  }

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
                style={[styles.input, erros.nome && styles.inputErro]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  setErros({ ...erros, nome: "" });
                }}
              />
              {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={[styles.input, erros.email && styles.inputErro]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErros({ ...erros, email: "" });
                }}
              />
              {erros.email && <Text style={styles.erro}>{erros.email}</Text>}

              <TextInput
                placeholder="Telefone"
                placeholderTextColor="#aaa"
                style={[styles.input, erros.telefone && styles.inputErro]}
                value={telefone}
                onChangeText={(text) => {
                  setTelefone(formatarTelefone(text));
                  setErros({ ...erros, telefone: "" });
                }}
              />
              {erros.telefone && (
                <Text style={styles.erro}>{erros.telefone}</Text>
              )}

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={[styles.input, erros.senha && styles.inputErro]}
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  setErros({ ...erros, senha: "" });
                }}
              />
              {erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}

              <TouchableOpacity style={styles.botaoCadastrar} onPress={register}>
                <Text style={styles.textoBotao}>Criar Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("LoginUser")}>
                <Text style={styles.linkLogin}>
                  Já tem conta?{" "}
                  <Text style={styles.corPrimaria}>Entrar</Text>
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  inputErro: {
    borderColor: "#ff4d4d",
  },

  erro: {
    color: "#ff4d4d",
    marginBottom: 10,
    marginLeft: 5,
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