import { apiFetch } from "@/lib/api";
import type { ProductsResponse, SortBy, OrderBy, Product } from "@/features/products/products.types";

export type ProductsQueryParams = {
  page: number;
  rows: number;
  sortBy: SortBy;
  orderBy: OrderBy;
};

export async function getProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
  // garante params obrigatórios sempre
  return apiFetch<ProductsResponse>("/products", {
    params: {
      page: params.page,
      rows: params.rows,
      sortBy: params.sortBy,
      orderBy: params.orderBy, // já é "ASC" | "DESC"
    },
    headers: { "Content-Type": "application/json" },
  });
}

export async function getProductById(id: string | number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
}
