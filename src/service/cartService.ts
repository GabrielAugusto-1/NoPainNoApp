import { api } from "./api";

export const cartService = {

  async getAll() {
    const response =
      await api.get("/cart");

    return response.data;
  },

  async create(data: any) {
    const response =
      await api.post("/cart", data);

    return response.data;
  },

  async update(
    id: string,
    data: any
  ) {

    const response =
      await api.put(
        `/cart/${id}`,
        data
      );

    return response.data;
  },

  async delete(id: string) {

    const response =
      await api.delete(
        `/cart/${id}`
      );

    return response.data;
  },
};