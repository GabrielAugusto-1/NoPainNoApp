import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CartContext } from "@/src/context/CartContext";

export default function CheckoutScreen() {
  const {
    cartItems,
    getSubtotal,
    getShippingCost,
    getDiscount,
    getTotal,
    setShippingCost,
    clearCart,
    couponCode,
  } = useContext(CartContext);

  const [cep, setCep] = useState("");
  const [shippingOptions] = useState([
    { id: "standard", name: "Padrão (7-10 dias)", cost: 10 },
    { id: "express", name: "Expresso (3-5 dias)", cost: 25 },
    { id: "fast", name: "Rápido (1-2 dias)", cost: 50 },
  ]);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    setShippingCost(selectedShipping.cost);
  }, [selectedShipping]);

  const handleCalculateShipping = () => {
    if (cep.length >= 5) {
      Alert.alert("Frete Calculado", `Frete para CEP ${cep}: R$ ${selectedShipping.cost.toFixed(2)}`);
    } else {
      Alert.alert("CEP Inválido", "Digite um CEP válido");
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert("Erro", "Digite seu nome completo");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Erro", "Digite um email válido");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Erro", "Digite seu telefone");
      return false;
    }
    if (!address.trim()) {
      Alert.alert("Erro", "Digite seu endereço");
      return false;
    }
    if (!city.trim()) {
      Alert.alert("Erro", "Digite sua cidade");
      return false;
    }
    if (!state.trim()) {
      Alert.alert("Erro", "Digite seu estado");
      return false;
    }
    if (!cep.trim()) {
      Alert.alert("Erro", "Digite seu CEP");
      return false;
    }
    return true;
  };

  const handleFinishOrder = async () => {
    if (!validateForm()) return;

    Alert.alert(
      "Confirmar Pedido",
      `Você está finalizando um pedido de R$ ${getTotal().toFixed(2)}\n\nDeseja continuar?`,
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              Alert.alert(
                "Sucesso!",
                "Pedido realizado com sucesso!\nNúmero do pedido: #" + Math.floor(Math.random() * 999999)
              );
              await clearCart();
            } catch (error) {
              Alert.alert("Erro", "Falha ao finalizar o pedido");
            }
          },
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error-outline" size={60} color="#999" />
        <Text style={styles.emptyText}>Carrinho vazio</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        <FlatList
          scrollEnabled={false}
          data={cartItems}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <View style={styles.itemSummary}>
              <View>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemQty}>Qtd: {item.quantidade}</Text>
              </View>
              <Text style={styles.itemTotal}>
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </Text>
            </View>
          )}
        />

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>R$ {getSubtotal().toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Frete:</Text>
          <Text style={styles.value}>R$ {getShippingCost().toFixed(2)}</Text>
        </View>
        {getDiscount() > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.label}>Desconto ({couponCode}):</Text>
            <Text style={[styles.value, styles.discount]}>
              -R$ {getDiscount().toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {getTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entrega</Text>
        
        <Text style={styles.label}>Opções de Frete</Text>
        {shippingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.shippingOption,
              selectedShipping.id === option.id && styles.shippingOptionSelected,
            ]}
            onPress={() => setSelectedShipping(option)}
          >
            <MaterialIcons
              name={selectedShipping.id === option.id ? "radio-button-checked" : "radio-button-unchecked"}
              size={20}
              color="#f05006"
            />
            <View style={styles.shippingInfo}>
              <Text style={styles.shippingName}>{option.name}</Text>
              <Text style={styles.shippingCost}>R$ {option.cost.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.label, styles.marginTop]}>CEP</Text>
        <View style={styles.cepInput}>
          <TextInput
            placeholder="00000-000"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={cep}
            onChangeText={setCep}
            maxLength={9}
          />
          <TouchableOpacity
            style={styles.calculateBtn}
            onPress={handleCalculateShipping}
          >
            <Text style={styles.calculateBtnText}>Calcular</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, styles.marginTop]}>Endereço</Text>
        <TextInput
          placeholder="Rua, Avenida, etc."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Cidade"
            placeholderTextColor="#aaa"
            style={[styles.input, styles.halfInput]}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            placeholder="Estado"
            placeholderTextColor="#aaa"
            style={[styles.input, styles.halfInput]}
            value={state}
            onChangeText={setState}
            maxLength={2}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          placeholder="Seu nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={[styles.label, styles.marginTop]}>Email</Text>
        <TextInput
          placeholder="seu@email.com"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, styles.marginTop]}>Telefone</Text>
        <TextInput
          placeholder="(11) 99999-9999"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={handleFinishOrder}
        >
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.finishBtnText}>Finalizar Pedido</Text>
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
  itemSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  itemQty: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  itemTotal: {
    color: "#f05006",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  value: {
    color: "#fff",
    fontWeight: "bold",
  },
  discount: {
    color: "#4caf50",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#f05006",
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
  shippingOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    marginVertical: 8,
  },
  shippingOptionSelected: {
    borderColor: "#f05006",
    backgroundColor: "#1a0a05",
  },
  shippingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  shippingName: {
    color: "#fff",
    fontWeight: "bold",
  },
  shippingCost: {
    color: "#f05006",
    fontSize: 12,
    marginTop: 4,
  },
  cepInput: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderColor: "#f05006",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 8,
  },
  calculateBtn: {
    backgroundColor: "#f05006",
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  calculateBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  marginTop: {
    marginTop: 15,
  },
  footer: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  finishBtn: {
    backgroundColor: "#f05006",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  finishBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  emptyText: {
    color: "#aaa",
    marginTop: 15,
  },
});