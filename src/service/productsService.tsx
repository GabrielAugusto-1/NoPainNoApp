import { api } from "./api";

export const productService = {

  // LISTAR PRODUTOS
  getAll: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  // CRIAR PRODUTO
  create: async (data: any) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  // EDITAR PRODUTO
  update: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // DELETAR PRODUTO
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};