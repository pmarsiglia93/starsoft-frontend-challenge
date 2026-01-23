import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ProductsResponse } from "./products.types";
import { getProducts, type ProductsQueryParams } from "@/services/api/products";

export function useProductsQuery(params: ProductsQueryParams) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
