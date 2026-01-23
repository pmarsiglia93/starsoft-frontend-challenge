export type SortBy = "id" | "name" | "brand" | "price";
export type OrderBy = "ASC" | "DESC";

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string; // vem como string da API
  createdAt: string;
};

export type ProductsResponse = {
  products: Product[];
  count: number;
};
