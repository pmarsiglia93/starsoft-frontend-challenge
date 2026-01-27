// src/pages/products/[id].tsx
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Header } from "@/components/Header/Header";
import styles from "@/styles/ProductDetails.module.scss";

import { useProductFromCache } from "@/features/products/product.fromCache";
import { useProductByIdQuery } from "@/features/products/product.queries";

const ProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;
  const cached = useProductFromCache(id);
  const { data, isLoading, isError } = useProductByIdQuery(
    !cached ? id : undefined,
  );

  const product = cached ?? data ?? null;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backBtn}>
            Voltar
          </Link>
        </div>

        {isLoading && !product ? (
          <p style={{ opacity: 0.85 }}>Carregando...</p>
        ) : isError && !product ? (
          <p style={{ opacity: 0.85 }}>Erro ao carregar produto.</p>
        ) : !product ? (
          <div style={{ opacity: 0.85 }}>
            <p>Produto não encontrado.</p>
            <Link href="/" className={styles.goCart}>
              Voltar para produtos
            </Link>
          </div>
        ) : (
          <section className={styles.content}>
            <div className={styles.imageBox}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            <div className={styles.info}>
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.description}>{product.description}</p>

              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {Number(product.price).toFixed(2)} ETH
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
