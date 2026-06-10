import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  
} from "react-native";

import { productService } from "@/services/products_service";
import { useNavigation } from "@react-navigation/native";

export default function Produtos() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();  
async function deletarProduto(id: string) {

  Alert.alert(
    "Excluir produto",
    "Tem certeza que deseja excluir este produto?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await productService.delete(id);
            carregarProdutos();
          } catch (error) {
            console.log("Erro ao deletar", error);
          }
        },
      },
    ]
  );
}
  // 🔥 BUSCAR PRODUTOS DO FIREBASE
  async function carregarProdutos() {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.log("Erro ao buscar produtos", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔁 ATUALIZA quando volta da tela de cadastro
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarProdutos();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.image} />

      <Text style={styles.nome}>{item.nome}</Text>

      <Text style={styles.preco}>
        R$ {Number(item.preco).toFixed(2)}
      </Text>

     <View style={styles.actions}>

        <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditarProduto", { produto: item })}
        >
            <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {

                console.log("ITEM:", item);

                deletarProduto(item.id);
            }}
            >
            <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>

     </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.titulo}>  Produtos</Text>

        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.addText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CadastrarProduto")}
          >
            <Text style={styles.addText}>+ Adicionar</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" color="#f05006" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={
            <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
              Nenhum produto cadastrado.
            </Text>
          }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  titulo: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#f05006",
    padding: 10,
    borderRadius: 8,
  },

  addText: {
    color: "white",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 10,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },

  nome: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  preco: {
    color: "#f05006",
    marginVertical: 5,
  },

  botao: {
    backgroundColor: "#f05006",
    padding: 6,
    borderRadius: 8,
  },

  botaoTexto: {
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
  },
  actions: {
  flexDirection: "row",
  marginTop: 10,
  gap: 10,
},

    editBtn: {
    backgroundColor: "#f05006",
    padding: 6,
    borderRadius: 8,
    },

    deleteBtn: {
    backgroundColor: "#db1d07",
    padding: 6,
    borderRadius: 8,
    },

    btnText: {
    color: "#fff",
    fontWeight: "bold",
    },
    });
