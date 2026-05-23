import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { auth, database } from "../../services/connectionFirebase";
import { ref, update, onValue } from "firebase/database";

export default function EditarPerfil() {

  const navigation = useNavigation<any>();
  const user = auth.currentUser;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");

  // 📥 PUXAR DADOS DO BANCO
  useEffect(() => {
    if (!user) return;

    const referencia = ref(database, "usuario/" + user.uid);

    const unsubscribe = onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        setNome(data.nome || "");
        setTelefone(data.telefone || "");
      }
    });

    return () => unsubscribe();

  }, []);

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

  // ✅ VALIDAR
  function validar() {
    const numeros = telefone.replace(/\D/g, "");

    if (!nome.trim()) {
      Alert.alert("Erro", "Digite seu nome");
      return false;
    }

    if (!numeros) {
      setErroTelefone("Digite o telefone");
      return false;
    }

    if (numeros.length < 11) {
      setErroTelefone("Telefone incompleto");
      return false;
    }

    setErroTelefone("");
    return true;
  }

  // 💾 SALVAR
  const salvar = async () => {
    if (!user) return;

    if (!validar()) return;

    try {
      const referencia = ref(database, "usuario/" + user.uid);

      await update(referencia, {
        nome,
        telefone,
      });

      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();

    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar");
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.card}>

        <Text style={styles.titulo}>Editar Perfil</Text>

        {/* NOME */}
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        {/* TELEFONE */}
        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#aaa"
          style={[
            styles.input,
            erroTelefone ? { borderColor: "red", borderWidth: 1 } : {}
          ]}
          value={telefone}
          onChangeText={(text) => {
            setTelefone(formatarTelefone(text));
            setErroTelefone("");
          }}
        />

        {erroTelefone ? (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {erroTelefone}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.botao} onPress={salvar}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },

  voltar: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  voltarTexto: {
    color: "#f05006",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 20,
  },

  titulo: {
    color: "white",
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  botao: {
    backgroundColor: "#f05006",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoTexto: {
    color: "white",
    fontWeight: "bold",
  },

});