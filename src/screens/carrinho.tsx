import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import { CartContext } from "@/src/context/CartContext";

export default function Carrinho() {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    loadCart,
  } = useContext(CartContext);

  const [cupom, setCupom] = useState("");
  const [cep, setCep] = useState("");
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "focus",
      loadCart
    );

    return unsubscribe;
  }, [navigation, loadCart]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc: number, item: any) =>
          acc +
          Number(item.preco || 0) *
            Number(item.quantidade || 1),
        0
      ),
    [cartItems]
  );

  const cepNumbers = cep.replace(/\D/g, "");
  const cepPrefix = Number(cepNumbers.slice(0, 2));

  const frete =
    subtotal === 0
      ? 0
      : subtotal >= 250
        ? 0
        : cepNumbers.length >= 2 &&
            cepPrefix >= 1 &&
            cepPrefix <= 39
          ? 18
          : 28;

  const cupomNormalizado =
    cupom.trim().toUpperCase();

  const desconto =
    cupomNormalizado === "DESCONTO10"
      ? subtotal * 0.1
      : cupomNormalizado === "FRETEGRATIS"
        ? frete
        : 0;

  const total = subtotal + frete - desconto;

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagem }}
        style={styles.image}
      />

      <View style={styles.infoArea}>
        <Text numberOfLines={2} style={styles.nome}>
          {item.nome}
        </Text>

        <Text style={styles.preco}>
          R$ {Number(item.preco || 0).toFixed(2)}
        </Text>

        <View style={styles.actionsRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                decrementQuantity(item.id)
              }
            >
              <Text style={styles.quantityText}>
                -
              </Text>
            </TouchableOpacity>

            <Text style={styles.quantidade}>
              {item.quantidade}
            </Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                incrementQuantity(item.id)
              }
            >
              <Text style={styles.quantityText}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              removeFromCart(item.id)
            }
            style={styles.deleteButton}
          >
            <Icon
              name="trash-outline"
              size={22}
              color="#ff4d4d"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Meu Carrinho
      </Text>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom:
            cartItems.length > 0 ? 380 : 120,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="cart-outline"
              size={60}
              color="#777"
            />

            <Text style={styles.emptyText}>
              Seu carrinho esta vazio
            </Text>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TextInput
            placeholder="Cupom: DESCONTO10 ou FRETEGRATIS"
            placeholderTextColor="#777"
            value={cupom}
            onChangeText={(text) =>
              setCupom(text.toUpperCase())
            }
            autoCapitalize="characters"
            style={styles.input}
          />

          <TextInput
            placeholder="CEP para calcular frete"
            placeholderTextColor="#777"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
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

            <Text style={styles.discount}>
              - R$ {desconto.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              R$ {total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutText}>
              Finalizar Compra
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCart}
          >
            <Text style={styles.clearText}>
              Limpar Tudo
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

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

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,77,77,0.1)",
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
    marginBottom: 12,
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
    marginVertical: 12,
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
    marginTop: 16,
    alignItems: "center",
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
    gap: 12,
  },

  emptyText: {
    color: "#777",
    fontSize: 18,
  },
});
