import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { auth, database } from "../../services/connectionFirebase";
import { onValue, ref } from "firebase/database";

export default function PerfilUser() {

  const navigation = useNavigation<any>();
  const sair = async () => {
  try {
    await signOut(auth);

    navigation.reset({
      index: 0,
      routes: [{ name: "LoginUser" }],
    });

  } catch (error) {
    Alert.alert("Erro", "Erro ao sair");
  }
};
  useEffect(() => {
  let unsubscribeDB: any;

  const unsubscribeAuth = auth.onAuthStateChanged((user) => {

    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginUser" }],
      });
      return;
    }

    const referencia = ref(database, "usuario/" + user.uid);

    unsubscribeDB = onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        setNome(data.nome || "");
        setTelefone(data.telefone || "");
        setEmail(data.email || "");
      }
    });

  });

  return () => {
    if (unsubscribeDB) unsubscribeDB();
    unsubscribeAuth();
  };

}, [navigation]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

 

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=3" }}
        style={styles.avatar}
      />

      {/* 🔥 AGORA VEM DO BANCO */}
      <Text style={styles.nome}>{nome}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>📧 {email}</Text>
        <Text style={styles.info}>📱 {telefone}</Text>
      </View>

      <View style={styles.cardsContainer}>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>🔥 Treinos feitos</Text>
          <Text style={styles.cardValor}>24</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>📅 Dias ativos</Text>
          <Text style={styles.cardValor}>12</Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.botaoEditar}
        onPress={() => navigation.navigate("EditarPerfil")}
      >
        <Text style={styles.botaoTexto}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSair}  onPress={sair}>
        <Text style={styles.botaoTexto} >Sair</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#000",
    paddingTop: 60,
    paddingBottom: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#f05006",
  },

  nome: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  infoBox: {
    alignItems: "center",
    marginBottom: 25,
  },

  info: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 5,
  },

  cardsContainer: {
    width: "90%",
  },

  card: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  cardTitulo: {
    color: "#aaa",
    fontSize: 14,
  },

  cardValor: {
    color: "#f05006",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  botaoEditar: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f05006",
  },

  botaoSair: {
    marginTop: 10,
    backgroundColor: "#f05006",
    padding: 12,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },

  botaoTexto: {
    color: "white",
    fontWeight: "bold",
  },

});