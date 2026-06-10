import { Product } from "@/src/models/Product";

const API_URL =
  "https://6a05172baa826ca75c097762.mockapi.io/api/v1/products";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na API de produtos: ${response.status}`);
  }

  return response.json();
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    return request<Product[]>(API_URL);
  },

  create: async (data: Product): Promise<Product> => {
    return request<Product>(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Product): Promise<Product> => {
    return request<Product>(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<Product> => {
    return request<Product>(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
