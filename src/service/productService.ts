import { api } from "./api";
import { Product } from "@/src/models/Product";

class ProductService {
  async getAll() {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  }

  async create(product: Product) {
    try {
      const response = await api.post("/products", product);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async update(id: string, product: Product) {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }

  async search(query: string) {
    try {
      const all = await this.getAll();
      return all.filter(
        (product: Product) =>
          product.nome.toLowerCase().includes(query.toLowerCase()) ||
          product.categoria.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  async filterByCategory(category: string) {
    try {
      const all = await this.getAll();
      return all.filter(
        (product: Product) =>
          product.categoria.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error("Erro ao filtrar por categoria:", error);
      throw error;
    }
  }

  async filterByPriceRange(minPrice: number, maxPrice: number) {
    try {
      const all = await this.getAll();
      return all.filter(
        (product: Product) =>
          product.preco >= minPrice && product.preco <= maxPrice
      );
    } catch (error) {
      console.error("Erro ao filtrar por preço:", error);
      throw error;
    }
  }
}

export const productService = new ProductService();