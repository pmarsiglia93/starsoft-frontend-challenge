import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "./products.types";

export function useProductFromCache(id?: string) {
  const queryClient = useQueryClient();

  return useMemo(() => {
    if (!id) return null;

    // pega TODAS as queries de produtos (infinite e normal)
    const all = queryClient.getQueriesData<any>({ queryKey: ["products"] });

    for (const [, data] of all) {
      if (!data) continue;

      // infinite query: { pages: [...] }
      if (data.pages?.length) {
        for (const page of data.pages) {
          const found = page?.products?.find((p: Product) => String(p.id) === id);
          if (found) return found;
        }
      }

      // query normal: { products: [...] }
      if (data.products?.length) {
        const found = data.products.find((p: Product) => String(p.id) === id);
        if (found) return found;
      }
    }

    return null;
  }, [id, queryClient]);
}
