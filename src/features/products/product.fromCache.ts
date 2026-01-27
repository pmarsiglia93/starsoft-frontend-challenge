import { useMemo } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { Product } from "./products.types";

type ProductsPage = {
  products?: Product[];
};

type ProductsInfiniteData = {
  pages?: ProductsPage[];
};

type ProductsListData = {
  products?: Product[];
};

type ProductsQueryData = ProductsInfiniteData | ProductsListData;

function hasPages(data: ProductsQueryData): data is ProductsInfiniteData {
  return Array.isArray((data as ProductsInfiniteData).pages);
}

export function useProductFromCache(id?: string) {
  const queryClient = useQueryClient();

  return useMemo(() => {
    if (!id) return null;

    const all = queryClient.getQueriesData<ProductsQueryData>({
      queryKey: ["products"] as QueryKey,
    });

    for (const [, data] of all) {
      if (!data) continue;

      if (hasPages(data) && data.pages?.length) {
        for (const page of data.pages) {
          const found = page?.products?.find((p) => String(p.id) === id);
          if (found) return found;
        }
      }

      if ("products" in data && data.products?.length) {
        const found = data.products.find((p) => String(p.id) === id);
        if (found) return found;
      }
    }

    return null;
  }, [id, queryClient]);
}
