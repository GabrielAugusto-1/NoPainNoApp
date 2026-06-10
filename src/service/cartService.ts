import { CartProduct } from "@/src/models/CartProduct";

const API_URL =
  "https://6a05172baa826ca75c097762.mockapi.io/api/v1/cart";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na API do carrinho: ${response.status}`);
  }

  return response.json();
}

export const cartService = {
  async getAll(): Promise<CartProduct[]> {
    return request<CartProduct[]>(API_URL);
  },

  async create(data: CartProduct): Promise<CartProduct> {
    return request<CartProduct>(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: CartProduct): Promise<CartProduct> {
    return request<CartProduct>(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<CartProduct> {
    return request<CartProduct>(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
