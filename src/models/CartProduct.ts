import { Product } from "./Product";

export interface CartProduct extends Product {
  productId?: string;
  quantidade: number;
}
