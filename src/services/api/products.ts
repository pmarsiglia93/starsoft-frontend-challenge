import { apiFetch } from "@/lib/api";
import type {
  ProductsResponse,
  SortBy,
  OrderBy,
  Product,
} from "@/features/products/products.types";

export type ProductsQueryParams = {
  page: number;
  rows: number;
  sortBy: SortBy;
  orderBy: OrderBy;
};

export async function getProducts(
  params: ProductsQueryParams,
): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>("/products", {
    params: {
      page: params.page,
      rows: params.rows,
      sortBy: params.sortBy,
      orderBy: params.orderBy,
    },
    headers: { "Content-Type": "application/json" },
  });
}

export async function findProductById(options: {
  id: string | number;
  rows?: number;
  sortBy?: SortBy;
  orderBy?: OrderBy;
  maxPages?: number;
}): Promise<Product | null> {
  const {
    id,
    rows = 50,
    sortBy = "id",
    orderBy = "ASC",
    maxPages = 20,
  } = options;

  const targetId = String(id);

  for (let page = 1; page <= maxPages; page++) {
    const data = await getProducts({ page, rows, sortBy, orderBy });

    const found = data.products.find((p) => String(p.id) === targetId);
    if (found) return found;

    if (page * rows >= data.count) break;
  }

  return null;
}
