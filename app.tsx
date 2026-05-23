import { NavigationContainer } from "@react-navigation/native";

import StackRoot from "./app/(tabs)/index";

import { CartProvider } from "./src/context/CartContext";

export default function App() {

  return (

    <CartProvider>

      <NavigationContainer>

        <StackRoot />

      </NavigationContainer>

    </CartProvider>
  );
}