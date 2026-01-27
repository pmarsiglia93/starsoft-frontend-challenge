import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { OrderBy, ProductsResponse, SortBy } from "./products.types";
import { getProducts, type ProductsQueryParams } from "@/services/api/products";

type InfiniteParams = {
  rows: number;
  sortBy: SortBy;
  orderBy: OrderBy;
};

export function useProductsInfiniteQuery(params: InfiniteParams) {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["products-infinite", params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getProducts({
        page: Number(pageParam),
        rows: params.rows,
        sortBy: params.sortBy,
        orderBy: params.orderBy,
      } as ProductsQueryParams),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.products.length, 0);
      const total = lastPage.count ?? 0;

      if (loaded >= total) return undefined;
      return allPages.length + 1;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
