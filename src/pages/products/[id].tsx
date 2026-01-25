import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/Header/Header";
import styles from "@/styles/ProductDetails.module.scss";

import type { Product } from "@/features/products/products.types";
import { useProductFromCache } from "@/features/products/product.fromCache";
import { findProductById } from "@/services/api/products";

const ProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  // 1) tenta cache primeiro (rápido, sem request)
  const cached = useProductFromCache(id);

  // 2) fallback via listagem paginada (quando abre direto)
  const [product, setProduct] = useState<Product | null>(null);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  const resolvedProduct = cached ?? product;

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!id) return;

      // se já tem cache, não precisa fallback
      if (cached) {
        setProduct(null);
        setFallbackError(null);
        setIsFallbackLoading(false);
        return;
      }

      setIsFallbackLoading(true);
      setFallbackError(null);

      try {
        const found = await findProductById({
          id,
          rows: 50,
          sortBy: "id",
          orderBy: "ASC",
          maxPages: 20,
        });

        if (!mounted) return;

        setProduct(found);
        setIsFallbackLoading(false);
      } catch (e) {
        if (!mounted) return;
        setFallbackError(e instanceof Error ? e.message : "Erro ao buscar produto");
        setIsFallbackLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [id, cached]);

  const showNotFound = useMemo(() => {
    // Só mostra "não encontrado" depois que a busca fallback terminou
    if (!id) return false;
    if (isFallbackLoading) return false;
    if (fallbackError) return false;
    return !resolvedProduct;
  }, [id, isFallbackLoading, fallbackError, resolvedProduct]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backBtn}>
            Voltar
          </Link>
        </div>

        {isFallbackLoading && (
          <div style={{ opacity: 0.85 }}>
            <p>Carregando produto...</p>
          </div>
        )}

        {fallbackError && (
          <div style={{ opacity: 0.85 }}>
            <p>Erro ao carregar produto: {fallbackError}</p>
            <Link href="/" className={styles.goCart}>
              Voltar para produtos
            </Link>
          </div>
        )}

        {showNotFound && (
          <div style={{ opacity: 0.85 }}>
            <p>Produto não encontrado.</p>
            <Link href="/" className={styles.goCart}>
              Voltar para produtos
            </Link>
          </div>
        )}

        {resolvedProduct && (
          <section className={styles.content}>
            <div className={styles.imageBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.image}
                src={resolvedProduct.image}
                alt={resolvedProduct.name}
              />
            </div>

            <div className={styles.info}>
              <h1 className={styles.title}>{resolvedProduct.name}</h1>
              <p className={styles.description}>{resolvedProduct.description}</p>

              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {Number(resolvedProduct.price).toFixed(2)} ETH
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;
