import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { Product } from "@/src/models/Product";
import { CartProduct } from "@/src/models/CartProduct";

import { cartService } from "../service/cartService";

export const CartContext =
  createContext({} as any);
  
export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cartItems, setCartItems] =
    useState<CartProduct[]>([]);

  // =========================
  // CARREGAR CARRINHO
  // =========================

  async function loadCart() {

    try {

      const data: CartProduct[] =
        await cartService.getAll();

      setCartItems(data);

    } catch (error) {

      console.log(
        "Erro ao carregar carrinho",
        error
      );
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  // =========================
  // ADICIONAR AO CARRINHO
  // =========================

  async function addToCart(
    product: Product
  ) {

    try {

      const exists = cartItems.find(
        (item) =>
          item.nome === product.nome
      );

      // =====================
      // SE JÁ EXISTE
      // =====================

      if (exists) {

        const updatedProduct: CartProduct = {
          ...exists,
          quantidade:
            exists.quantidade + 1,
        };

        await cartService.update(
          exists.id!,
          updatedProduct
        );

      } else {

        // =====================
        // SE NÃO EXISTE
        // =====================

        const newProduct: CartProduct = {
          ...product,
          quantidade: 1,
        };

        await cartService.create(
          newProduct
        );
      }

      await loadCart();

    } catch (error) {

      console.log(
        "Erro ao adicionar",
        error
      );
    }
  }

  // =========================
  // REMOVER ITEM
  // =========================

  async function removeFromCart(
    id: string
  ) {

    try {

      await cartService.delete(
        id!
      );

      await loadCart();

    } catch (error) {

      console.log(
        "Erro ao remover",
        error
      );
    }
  }

  // =========================
  // LIMPAR CARRINHO
  // =========================

  async function clearCart() {

    try {

      for (const item of cartItems) {

        await cartService.delete(
          item.id!
        );
      }

      setCartItems([]);

    } catch (error) {

      console.log(
        "Erro ao limpar carrinho",
        error
      );
    }
  }

  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}