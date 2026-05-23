import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { cartService } from "@/src/service/cartService";

export default function Carrinho() {

  // ===============================
  // STATES
  // ===============================

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [cupom, setCupom] = useState("");

  // ===============================
  // CARREGAR CARRINHO
  // ===============================

  async function carregarCarrinho() {

    try {

      const data = await cartService.getAll();

      setCartItems(data);

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  // ===============================
  // QUANTIDADE
  // ===============================

  async function aumentarQuantidade(id: string) {

    const item = cartItems.find(
      (produto) => produto.id === id
    );

    if (!item) return;

    const novaQuantidade =
      item.quantidade + 1;

    try {

      await cartService.update(id, {
        ...item,
        quantidade: novaQuantidade,
      });

      setCartItems((oldItems) =>
        oldItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantidade: novaQuantidade,
              }
            : item
        )
      );

    } catch (error) {

      console.log(error);

    }
  }

  async function diminuirQuantidade(id: string) {

    const item = cartItems.find(
      (produto) => produto.id === id
    );

    if (!item || item.quantidade <= 1)
      return;

    const novaQuantidade =
      item.quantidade - 1;

    try {

      await cartService.update(id, {
        ...item,
        quantidade: novaQuantidade,
      });

      setCartItems((oldItems) =>
        oldItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantidade: novaQuantidade,
              }
            : item
        )
      );

    } catch (error) {

      console.log(error);

    }
  }

  // ===============================
  // REMOVER ITEM
  // ===============================

  async function removerItem(id: string) {

    try {

      await cartService.delete(id);

      setCartItems((oldItems) =>
        oldItems.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      console.log(error);

    }
  }

  // ===============================
  // LIMPAR CARRINHO
  // ===============================

  async function limparCarrinho() {

    try {

      for (const item of cartItems) {

        await cartService.delete(item.id);

      }

      setCartItems([]);

    } catch (error) {

      console.log(error);

    }
  }

  // ===============================
  // TOTALIZAÇÃO
  // ===============================

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.preco * item.quantidade,
    0
  );

  const frete = subtotal > 0 ? 20 : 0;

  const desconto =
    cupom === "DESCONTO10"
      ? subtotal * 0.1
      : 0;

  const total =
    subtotal + frete - desconto;

  // ===============================
  // CARD PRODUTO
  // ===============================

  const renderItem = ({ item }: any) => (

    <View style={styles.card}>

      <Image
        source={{ uri: item.imagem }}
        style={styles.image}
      />

      <View style={styles.infoArea}>

        <Text
          numberOfLines={2}
          style={styles.nome}
        >
          {item.nome}
        </Text>

        <Text style={styles.preco}>
          R$ {item.preco.toFixed(2)}
        </Text>

        <View style={styles.actionsRow}>

          <View
            style={
              styles.quantityContainer
            }
          >

            <TouchableOpacity
              style={
                styles.quantityButton
              }
              onPress={() =>
                diminuirQuantidade(
                  item.id
                )
              }
            >
              <Text
                style={
                  styles.quantityText
                }
              >
                -
              </Text>
            </TouchableOpacity>

            <Text
              style={styles.quantidade}
            >
              {item.quantidade}
            </Text>

            <TouchableOpacity
              style={
                styles.quantityButton
              }
              onPress={() =>
                aumentarQuantidade(
                  item.id
                )
              }
            >
              <Text
                style={
                  styles.quantityText
                }
              >
                +
              </Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            onPress={() =>
              removerItem(item.id)
            }
          >
            <Text style={styles.remover}>
              Remover
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );

  // ===============================
  // JSX
  // ===============================

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Meu Carrinho
      </Text>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={{
          paddingBottom: 320,
        }}
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={

          <View
            style={styles.emptyContainer}
          >

            <Text
              style={styles.emptyIcon}
            >
              🛒
            </Text>

            <Text
              style={styles.emptyText}
            >
              Seu carrinho está vazio
            </Text>

          </View>
        }
      />

      {cartItems.length > 0 && (

        <View style={styles.footer}>

          <TextInput
            placeholder="Cupom de desconto"
            placeholderTextColor="#777"
            value={cupom}
            onChangeText={setCupom}
            style={styles.input}
          />

          <View style={styles.totalRow}>

            <Text style={styles.label}>
              Subtotal
            </Text>

            <Text style={styles.value}>
              R$ {subtotal.toFixed(2)}
            </Text>

          </View>

          <View style={styles.totalRow}>

            <Text style={styles.label}>
              Frete
            </Text>

            <Text style={styles.value}>
              R$ {frete.toFixed(2)}
            </Text>

          </View>

          <View style={styles.totalRow}>

            <Text style={styles.label}>
              Desconto
            </Text>

            <Text
              style={styles.discount}
            >
              - R${" "}
              {desconto.toFixed(2)}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>

            <Text
              style={styles.totalLabel}
            >
              Total
            </Text>

            <Text style={styles.total}>
              R$ {total.toFixed(2)}
            </Text>

          </View>

          <TouchableOpacity
            style={
              styles.checkoutButton
            }
          >

            <Text
              style={
                styles.checkoutText
              }
            >
              Finalizar Compra
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={
              limparCarrinho
            }
          >

            <Text style={styles.clearText}>
              Limpar Carrinho
            </Text>

          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}

// ===============================
// STYLES
// ===============================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 22,
    flexDirection: "row",
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor:
      "rgba(240,80,6,0.15)",

    shadowColor: "#f05006",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: "#222",
  },

  infoArea: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  nome: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  preco: {
    color: "#f05006",
    fontSize: 24,
    fontWeight: "bold",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },

  quantityButton: {
    backgroundColor: "#f05006",
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  quantidade: {
    color: "#fff",
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: "bold",
  },

  remover: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
  },

  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    color: "#aaa",
    fontSize: 15,
  },

  value: {
    color: "#fff",
    fontSize: 15,
  },

  discount: {
    color: "#00c853",
    fontSize: 15,
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 14,
  },

  totalLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  total: {
    color: "#f05006",
    fontSize: 30,
    fontWeight: "bold",
  },

  checkoutButton: {
    backgroundColor: "#f05006",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",

    shadowColor: "#f05006",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  clearButton: {
    marginTop: 14,
    alignItems: "center",
  },

  clearText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 15,
  },

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