import type { Product } from "@/features/products/products.types";
import type { CartItem } from "./cart.slice";

export function mapProductToCartItem(product: Product): Omit<CartItem, "quantity"> {
  return {
    id: String(product.id),
    name: product.name,
    imageUrl: product.image,
    price: Number(product.price),
  };
}
