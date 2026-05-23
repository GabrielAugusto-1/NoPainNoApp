import React, { useEffect, useState,useContext } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { CartContext } from "../context/CartContext";
import { productService } from "@/services/products_service";
import { useNavigation } from "@react-navigation/native";

export default function Produtos() {

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigation = useNavigation<any>();

  // ===============================
  // BUSCAR PRODUTOS
  // ===============================

  async function carregarProdutos() {

    try {

      const data = await productService.getAll();

      setProducts(data);
      setFilteredProducts(data);

    } catch (error) {

      console.log(
        "Erro ao buscar produtos",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // ===============================
  // ATUALIZA AO VOLTAR
  // ===============================

  useEffect(() => {

    const unsubscribe =
      navigation.addListener(
        "focus",
        () => {
          carregarProdutos();
        }
      );

    return unsubscribe;

  }, [navigation]);

  // ===============================
  // BUSCA
  // ===============================

  function handleSearch(text: string) {

    setSearch(text);

    const filtered = products.filter(
      (item: any) =>
        item.nome
          .toLowerCase()
          .includes(text.toLowerCase())
    );

    setFilteredProducts(filtered);
  }

  // ===============================
  // CARD
  // ===============================

  const renderItem = ({ item }: any) => (

    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.card}
    >

      {/* IMAGEM */}

      <Image
        source={{ uri: item.imagem }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* CONTEÚDO */}

      <View style={styles.infoArea}>

        {/* CATEGORIA */}

        <View style={styles.categoryContainer}>

          <Text style={styles.categoryText}>
            {item.categoria}
          </Text>

        </View>

        {/* NOME */}

        <Text
          numberOfLines={2}
          style={styles.nome}
        >
          {item.nome}
        </Text>

        {/* MARCA */}

        <Text style={styles.marca}>
          {item.marca}
        </Text>

        {/* PREÇO */}

        <Text style={styles.preco}>
          R$ {Number(item.preco).toFixed(2)}
        </Text>

        {/* BOTÃO */}

        <TouchableOpacity
          style={styles.botao}
            onPress={() => {
  if (!addToCart) return;

  addToCart(item);
  alert("Produto adicionado ao carrinho!");
}}
            
        >

          <Text style={styles.botaoTexto}>
            Adicionar ao Carrinho
          </Text>

        </TouchableOpacity>

      </View>

    </TouchableOpacity>
  );

  // ===============================
  // JSX
  // ===============================

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.titulo}>
            Produtos
          </Text>

          <Text style={styles.subtitulo}>
            Suplementos e acessórios fitness
          </Text>

        </View>

        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate(
                "Produtoadmin"
              )
            }
          >

            <Text style={styles.addText}>
              Editar
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate(
                "CadastrarProduto"
              )
            }
          >

            <Text style={styles.addText}>
              + Novo
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>

        <Text style={styles.searchIcon}>
          🔍
        </Text>

        <TextInput
          placeholder="Buscar produtos..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />

      </View>

      {/* LOADING */}

      {loading ? (

        <ActivityIndicator
          size="large"
          color="#f05006"
        />

      ) : (

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          ListEmptyComponent={

            <View
              style={styles.emptyContainer}
            >

              <Text style={styles.emptyIcon}>
                📦
              </Text>

              <Text style={styles.emptyText}>
                Nenhum produto encontrado
              </Text>

            </View>
          }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  // ===============================
  // CONTAINER
  // ===============================

  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ===============================
  // HEADER
  // ===============================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  titulo: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#777",
    marginTop: 4,
    fontSize: 14,
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    backgroundColor: "#1a1a1a",

    paddingVertical: 11,
    paddingHorizontal: 16,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  addButton: {
    backgroundColor: "#f05006",

    paddingVertical: 11,
    paddingHorizontal: 16,

    borderRadius: 14,
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // ===============================
  // SEARCH
  // ===============================

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#111",

    borderRadius: 18,

    paddingHorizontal: 16,

    marginBottom: 24,

    height: 58,

    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },

  // ===============================
  // CARD
  // ===============================

  card: {
    backgroundColor: "#111",

    borderRadius: 28,

    marginBottom: 22,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(240,80,6,0.12)",

    shadowColor: "#f05006",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.18,

    shadowRadius: 10,

    elevation: 8,
  },

  image: {
    width: "100%",
    height: 230,
    backgroundColor: "#1a1a1a",
  },

  infoArea: {
    padding: 18,
  },

  // ===============================
  // CATEGORY
  // ===============================

  categoryContainer: {
    backgroundColor:
      "rgba(240,80,6,0.12)",

    borderWidth: 1,
    borderColor: "#f05006",

    alignSelf: "flex-start",

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 999,
  },

  categoryText: {
    color: "#f05006",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
  },

  // ===============================
  // TEXTOS
  // ===============================

  nome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
  },

  marca: {
    color: "#888",
    fontSize: 14,
    marginBottom: 18,
  },

  preco: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 18,
  },

  // ===============================
  // BOTÃO
  // ===============================

  botao: {
    backgroundColor: "#f05006",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",

    shadowColor: "#f05006",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.35,

    shadowRadius: 8,

    elevation: 5,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // ===============================
  // EMPTY
  // ===============================

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },

  emptyText: {
    color: "#777",
    fontSize: 18,
  },

});