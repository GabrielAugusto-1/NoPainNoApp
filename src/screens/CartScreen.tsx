import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CartContext } from "@/src/context/CartContext";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getShippingCost,
    getDiscount,
    getTotal,
    couponCode,
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const handleClearCart = () => {
    Alert.alert(
      "Limpar Carrinho",
      "Tem certeza que deseja limpar todo o carrinho?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Limpar",
          onPress: clearCart,
          style: "destructive",
        },
      ]
    );
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja remover este item?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Remover",
          onPress: () => removeFromCart(id),
          style: "destructive",
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-cart" size={80} color="#999" />
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens do Carrinho</Text>
        <FlatList
          scrollEnabled={false}
          data={cartItems}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemCategory}>{item.categoria}</Text>
                <Text style={styles.itemPrice}>
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </Text>
              </View>

              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id!, item.quantidade - 1)
                  }
                >
                  <MaterialIcons name="remove" size={20} color="#f05006" />
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantidade}</Text>

                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id!, item.quantidade + 1)
                  }
                >
                  <MaterialIcons name="add" size={20} color="#f05006" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id!)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={24} color="#f05006" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cupom de Desconto</Text>
        {couponCode ? (
          <View style={styles.couponApplied}>
            <Text style={styles.couponText}>✓ Cupom {couponCode} aplicado!</Text>
            <TouchableOpacity
              onPress={handleRemoveCoupon}
              style={styles.removeCouponBtn}
            >
              <Text style={styles.removeCouponText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.couponInput}>
            <TextInput
              placeholder="Digite o cupom"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={couponInput}
              onChangeText={setCouponInput}
            />
            <TouchableOpacity
              onPress={handleApplyCoupon}
              style={styles.applyCouponBtn}
            >
              <Text style={styles.applyCouponText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.couponHint}>Teste: PROMO10, PROMO20, DESCONTO15</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal:</Text>
          <Text style={styles.priceValue}>
            R$ {getSubtotal().toFixed(2)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Frete:</Text>
          <Text style={styles.priceValue}>
            R$ {getShippingCost().toFixed(2)}
          </Text>
        </View>

        {getDiscount() > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Desconto ({couponCode}):</Text>
            <Text style={[styles.priceValue, styles.discount]}>
              -R$ {getDiscount().toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {getTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.checkout}
          onPress={() => navigation.navigate("Checkout")}
        >
          <MaterialIcons name="payment" size={20} color="#fff" />
          <Text style={styles.checkoutText}>Ir para Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClearCart}
        >
          <Text style={styles.clearBtnText}>Limpar Tudo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.continueBtnText}>Continuar Comprando</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 15,
  },
  section: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f05006",
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#f05006",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  itemCategory: {
    fontSize: 12,
    color: "#aaa",
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: "#f05006",
    fontWeight: "bold",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 10,
  },
  quantity: {
    width: 30,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    marginVertical: 15,
  },
  continueShopping: {
    backgroundColor: "#f05006",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  continueShoppingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  couponInput: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderColor: "#f05006",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
  },
  applyCouponBtn: {
    backgroundColor: "#f05006",
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyCouponText: {
    color: "#fff",
    fontWeight: "bold",
  },
  couponApplied: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a4d2e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  couponText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  removeCouponBtn: {
    backgroundColor: "#f05006",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeCouponText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  couponHint: {
    fontSize: 11,
    color: "#888",
    marginTop: 8,
    fontStyle: "italic",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  priceLabel: {
    color: "#aaa",
    fontSize: 13,
  },
  priceValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  discount: {
    color: "#4caf50",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#444",
    marginTop: 12,
  },
  totalLabel: {
    color: "#f05006",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    color: "#f05006",
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: {
    gap: 10,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  checkout: {
    backgroundColor: "#f05006",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  clearBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  continueBtn: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f05006",
  },
  continueBtnText: {
    color: "#f05006",
    fontWeight: "bold",
  },
});