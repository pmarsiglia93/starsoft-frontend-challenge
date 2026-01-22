import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OrderBy, ProductsResponse, SortBy } from "./nfts.types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-challenge.starsoft.games/api/v1";

export type ProductsQueryParams = {
  page: number;
  rows: number;
  sortBy: SortBy;
  orderBy: OrderBy;
};

export async function fetchProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
  const qs = new URLSearchParams({
    page: String(params.page),
    rows: String(params.rows),
    sortBy: params.sortBy,
    orderBy: String(params.orderBy).toUpperCase(), // garante ASC/DESC
  });

  const res = await fetch(`${API_BASE}/products?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text}`);
  }

  return res.json();
}

export function useProductsQuery(params: ProductsQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData, // React Query v5 (substitui keepPreviousData: true)
    staleTime: 30_000,
  });
}
