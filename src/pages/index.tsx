import type { NextPage } from "next";
import { useMemo, useState } from "react";
import type { OrderBy, SortBy } from "@/features/nfts/nfts.types";
import { useProductsQuery } from "@/features/nfts/nfts.queries";

const Home: NextPage = () => {
  const [page, setPage] = useState(1);

  // parâmetros obrigatórios da API
  const rows = 12;
  const sortBy: SortBy = "id";
  const orderBy: OrderBy = "ASC";

  const queryParams = useMemo(
    () => ({ page, rows, sortBy, orderBy }),
    [page, rows, sortBy, orderBy]
  );

  const { data, isLoading, isError, error, isFetching } = useProductsQuery(queryParams);

  if (isLoading) return <p style={{ padding: 24 }}>Carregando...</p>;
  if (isError) return <p style={{ padding: 24 }}>Erro: {(error as Error).message}</p>;

  const products = data?.products ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / rows));

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Produtos</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Total: {total} {isFetching ? "(atualizando...)" : ""}
      </p>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          marginTop: 16,
        }}
      >
        {products.map((p) => (
          <article
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "100%", height: 160, objectFit: "contain" }}
            />

            <strong>{p.name}</strong>
            <span style={{ opacity: 0.85 }}>
              R$ {Number(p.price).toFixed(2)}
            </span>

            <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
              {p.description}
            </p>
          </article>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
        <button onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page <= 1}>
          Anterior
        </button>

        <span>
          Página {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
          disabled={page >= totalPages}
        >
          Próxima
        </button>
      </div>
    </main>
  );
};

export default Home;
