import type { NextPage } from "next";
import { useMemo } from "react";

import { Header } from "@/components/Header/Header";
import { ProductCard } from "@/components/ProductCard/ProductCard";

import styles from "@/styles/Home.module.scss";
import { useProductsInfiniteQuery } from "@/features/products/products.infinite.queries";
import type { OrderBy, SortBy } from "@/features/products/products.types";

const Home: NextPage = () => {
  // Pelo Figma: layout “load more” com grid 4 colunas => 8 itens por clique (2 linhas)
  const rows = 8;

  const sortBy: SortBy = "id";
  const orderBy: OrderBy = "ASC";

  const baseParams = useMemo(() => ({ rows, sortBy, orderBy }), [rows, sortBy, orderBy]);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsInfiniteQuery(baseParams);

  const pages = data?.pages ?? [];
  const products = pages.flatMap((p) => p.products);
  const total = pages[0]?.count ?? 0;

  const loaded = products.length;
  const progress = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {isLoading && <p>Carregando...</p>}

        {isError && <p>Erro: {(error as Error).message}</p>}

        {!isLoading && !isError && (
          <>
            <section className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </section>

            <div className={styles.loadMoreArea}>
              <div className={styles.progressTrack} aria-label="Progresso">
                <div
                  className={styles.progressFill}
                  style={{ ["--progress" as any]: `${progress}%` }}
                />
              </div>

              {hasNextPage ? (
                <button
                  type="button"
                  className={styles.loadMoreButton}
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
                </button>
              ) : (
                <div className={styles.doneText}>Você já viu tudo</div>
              )}

              {isFetching && !isFetchingNextPage ? (
                <div style={{ opacity: 0.7, fontSize: 12 }}>Atualizando...</div>
              ) : null}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
