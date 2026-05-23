import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import PerfilUser from "./perfilUser";
import Produtos from "./products"; 
import Carrinho from "./carrinho";

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>🏠 Home</Text>
    </View>
  );
}

function Treinos() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>🏋️ Treinos</Text>
    </View>
  );
}





export default function AreaUser() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#f05006",
        tabBarInactiveTintColor: "#777",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          if (route.name === "Treinos") iconName = focused ? "barbell" : "barbell-outline";
          if (route.name === "Produtos") iconName = focused ? "storefront": "storefront-outline";
          if (route.name === "Carrinho") iconName = focused ? "cart": "cart-outline";
          if (route.name === "Perfil") iconName = focused ? "person" : "person-outline";

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Treinos" component={Treinos} />
      <Tab.Screen name="Produtos" component={Produtos} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Perfil" component={PerfilUser} />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});