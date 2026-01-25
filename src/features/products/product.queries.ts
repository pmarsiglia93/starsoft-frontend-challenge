import { useQuery } from "@tanstack/react-query";
import type { Product } from "./products.types";
import { findProductById } from "@/services/api/products";

export function useProductByIdQuery(id?: string) {
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      return findProductById({ id });
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
