import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { productService } from "@/services/products_service";

export default function EditarProduto() {

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { produto } = route.params;

  const [nome, setNome] = useState(produto.nome);
  const [marca, setMarca] = useState(produto.marca);
  const [categoria, setCategoria] = useState(produto.categoria);
  const [preco, setPreco] = useState(String(produto.preco));
  const [imagem, setImagem] = useState(produto.imagem);

  const [erros, setErros] = useState<any>({});

  function validar() {

    const novosErros: any = {};

    if (!nome.trim()) {
      novosErros.nome = "Digite o nome";
    }

    if (!marca.trim()) {
      novosErros.marca = "Digite a marca";
    }

    if (!categoria.trim()) {
      novosErros.categoria = "Digite a categoria";
    }

    if (!preco) {
      novosErros.preco = "Digite o preço";
    } else if (isNaN(Number(preco))) {
      novosErros.preco = "Preço inválido";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function editarProduto() {

    if (!validar()) return;

    try {

      await productService.update(produto.id, {
        nome,
        marca,
        categoria,
        preco: Number(preco),
        imagem,
      });

      navigation.goBack();

    } catch (error) {

      console.log(error);

    }
  }

  const formValido =
    nome &&
    marca &&
    categoria &&
    preco;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios"
        ? "padding"
        : undefined
      }
    >

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.voltarTexto}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <View style={styles.card}>

        <Text style={styles.titulo}>
          Editar Produto
        </Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#aaa"
          style={[
            styles.input,
            erros.nome && styles.inputErro
          ]}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Marca"
          placeholderTextColor="#aaa"
          style={[
            styles.input,
            erros.marca && styles.inputErro
          ]}
          value={marca}
          onChangeText={setMarca}
        />

        <TextInput
          placeholder="Categoria"
          placeholderTextColor="#aaa"
          style={[
            styles.input,
            erros.categoria && styles.inputErro
          ]}
          value={categoria}
          onChangeText={setCategoria}
        />

        <TextInput
          placeholder="Preço"
          placeholderTextColor="#aaa"
          style={[
            styles.input,
            erros.preco && styles.inputErro
          ]}
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Imagem"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={imagem}
          onChangeText={setImagem}
        />

        <TouchableOpacity
          style={[
            styles.botao,
            {
              opacity: formValido ? 1 : 0.5
            }
          ]}
          disabled={!formValido}
          onPress={editarProduto}
        >
          <Text style={styles.botaoTexto}>
            Salvar Alterações
          </Text>
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
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
    fontSize: 16,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 20,
  },

  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  inputErro: {
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },

  botao: {
    backgroundColor: "#f05006",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});