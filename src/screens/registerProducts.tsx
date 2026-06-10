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
import { useNavigation } from "@react-navigation/native";
import { productService } from "@/services/products_service";

export default function CadastrarProduto() {

  const navigation = useNavigation<any>();

  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  const [erros, setErros] = useState<any>({});

  // ✅ VALIDAR
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
    } else if (Number(preco) <= 0) {
      novosErros.preco = "Preço deve ser maior que 0";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // 🚀 SALVAR
  const cadastrar = async () => {
    if (!validar()) return;

    try {
      await productService.create({
        nome,
        marca,
        categoria,
        preco: Number(preco),
        imagem: imagem || "https://via.placeholder.com/150",
      });

      navigation.goBack();

    } catch (error) {
      console.log(error);
    }
  };

  const formValido = nome && preco && marca && categoria;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {/* VOLTAR */}
      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.card}>

        <Text style={styles.titulo}>Novo Produto</Text>

        {/* NOME */}
        <TextInput
          placeholder="Nome do produto"
          placeholderTextColor="#aaa"
          style={[styles.input, erros.nome && styles.inputErro]}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setErros({ ...erros, nome: "" });
          }}
        />
        {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

        {/* MARCA */}
        <TextInput
          placeholder="Marca"
          placeholderTextColor="#aaa"
          style={[styles.input, erros.marca && styles.inputErro]}
          value={marca}
          onChangeText={(text) => {
            setMarca(text);
            setErros({ ...erros, marca: "" });
          }}
        />
        {erros.marca && <Text style={styles.erro}>{erros.marca}</Text>}

        {/* CATEGORIA */}
        <TextInput
          placeholder="Categoria (ex: suplemento)"
          placeholderTextColor="#aaa"
          style={[styles.input, erros.categoria && styles.inputErro]}
          value={categoria}
          onChangeText={(text) => {
            setCategoria(text);
            setErros({ ...erros, categoria: "" });
          }}
        />
        {erros.categoria && <Text style={styles.erro}>{erros.categoria}</Text>}

        {/* PREÇO */}
        <TextInput
          placeholder="Preço (ex: 99.90)"
          placeholderTextColor="#aaa"
          style={[styles.input, erros.preco && styles.inputErro]}
          value={preco}
          onChangeText={(text) => {
            setPreco(text);
            setErros({ ...erros, preco: "" });
          }}
          keyboardType="numeric"
        />
        {erros.preco && <Text style={styles.erro}>{erros.preco}</Text>}

        {/* IMAGEM */}
        <TextInput
          placeholder="URL da imagem (opcional)"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={imagem}
          onChangeText={setImagem}
        />

        <TouchableOpacity
          style={[
            styles.botao,
            { opacity: formValido ? 1 : 0.5 }
          ]}
          disabled={!formValido}
          onPress={cadastrar}
        >
          <Text style={styles.botaoTexto}>Salvar Produto</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },

  titulo: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  inputErro: {
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },

  erro: {
    color: "#ff4d4d",
    marginBottom: 10,
    marginLeft: 5,
  },

  botao: {
    backgroundColor: "#f05006",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  botaoTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

});