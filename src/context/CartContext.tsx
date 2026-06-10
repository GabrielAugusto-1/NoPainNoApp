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

      const exists = cartItems.find((item) =>
        item.productId
          ? item.productId === product.id
          : item.nome === product.nome
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
          nome: product.nome,
          marca: product.marca,
          categoria: product.categoria,
          preco: Number(product.preco),
          imagem:
            product.imagem ||
            "https://via.placeholder.com/150",
          productId: product.id,
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

  async function incrementQuantity(id: string) {
    const item = cartItems.find(
      (cartItem) => cartItem.id === id
    );

    if (!item) return;

    await cartService.update(id, {
      ...item,
      quantidade: item.quantidade + 1,
    });

    await loadCart();
  }

  async function decrementQuantity(id: string) {
    const item = cartItems.find(
      (cartItem) => cartItem.id === id
    );

    if (!item) return;

    if (item.quantidade <= 1) {
      await removeFromCart(id);
      return;
    }

    await cartService.update(id, {
      ...item,
      quantidade: item.quantidade - 1,
    });

    await loadCart();
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
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}
