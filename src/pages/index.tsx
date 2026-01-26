import type { GetServerSideProps, NextPage } from "next";
import { useMemo } from "react";
import { useRouter } from "next/router";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
  type DehydratedState,
} from "@tanstack/react-query";

import { Header } from "@/components/Header/Header";
import { ProductCard } from "@/components/ProductCard/ProductCard";

import styles from "@/styles/Home.module.scss";

import type { OrderBy, SortBy } from "@/features/products/products.types";
import { getProducts } from "@/services/api/products";
import { useProductsInfiniteQuery } from "@/features/products/products.infinite.queries";

type Props = {
  dehydratedState: DehydratedState;
};

const HomePage: NextPage<Props> = ({ dehydratedState }) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeContent />
    </HydrationBoundary>
  );
};

function HomeContent() {
  const router = useRouter();

  // Figma: grid 4 colunas e botão "Carregar mais" (2 linhas => 8 itens)
  const rows = 8;
  const sortBy: SortBy = "id";
  const orderBy: OrderBy = "ASC";

  const baseParams = useMemo(
    () => ({ rows, sortBy, orderBy }),
    [rows, sortBy, orderBy]
  );

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
  const progress =
    total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {isLoading ? (
          <p style={{ opacity: 0.85 }}>Carregando...</p>
        ) : isError ? (
          <p style={{ opacity: 0.85 }}>
            Erro: {(error as Error)?.message ?? "Erro ao carregar produtos."}
          </p>
        ) : (
          <>
            <section className={styles.grid}>
              {products.map((p, index) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={index}
                  onClick={() => router.push(`/products/${p.id}`)}
                />
              ))}
            </section>

            {/* ✅ BOTÃO QUE VOCÊ QUERIA (CARREGAR MAIS) */}
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
                  {isFetchingNextPage ? "Carregando..." : "CARREGAR MAIS"}
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
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const queryClient = new QueryClient();

  const baseParams = { rows: 8, sortBy: "id" as const, orderBy: "ASC" as const };

  // ✅ ESSA KEY PRECISA BATER COM: ["products-infinite", params]
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products-infinite", baseParams],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getProducts({
        page: Number(pageParam),
        rows: baseParams.rows,
        sortBy: baseParams.sortBy,
        orderBy: baseParams.orderBy,
      }),
    staleTime: 30_000,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default HomePage;
