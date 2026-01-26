import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import styles from "./ProductCard.module.scss";
import type { Product } from "@/features/products/products.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cart/cart.slice";
import { selectCartItemsMap } from "@/store/cart/cart.selectors";
import { mapProductToCartItem } from "@/store/cart/cart.mappers";

type Props = {
  product: Product;
  onClick?: () => void; // opcional: se você quiser controlar navegação por router
  index?: number; // opcional: stagger no grid
};

export function ProductCard({ product, onClick, index = 0 }: Props) {
  const dispatch = useAppDispatch();
  const itemsMap = useAppSelector(selectCartItemsMap);
  const reduceMotion = useReducedMotion();

  const id = String(product.id);
  const isInCart = Boolean(itemsMap[id]);

  const priceEth = useMemo(() => {
    const n = Number(product.price);
    if (Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  }, [product.price]);

  function handleBuy() {
    if (isInCart) return;
    dispatch(addToCart(mapProductToCartItem(product)));
  }

  const detailsHref = `/products/${product.id}`;

  return (
    <motion.article
      className={styles.card}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
        delay: Math.min(index * 0.03, 0.25),
      }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
    >
      {/* Imagem clicável: Link (Next) é o melhor padrão */}
      <motion.div
        className={styles.media}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <Link
          href={detailsHref}
          aria-label={`Abrir detalhes de ${product.name}`}
          onClick={onClick}
          className={styles.mediaLink}
        >
          <Image
            className={styles.image}
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
          />
        </Link>
      </motion.div>

      <div className={styles.content}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.priceRow}>
          <span className={styles.ethIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l7 10-7 4-7-4 7-10Z"
                fill="var(--color-white)"
                opacity="0.9"
              />
              <path
                d="M12 22l7-10-7 4-7-4 7 10Z"
                fill="var(--color-white)"
                opacity="0.6"
              />
            </svg>
          </span>
          <span className={styles.price}>{priceEth} ETH</span>
        </div>

        {/* CTA de detalhes: "Veja mais" (pra ficar mais próximo do Figma) */}
        <Link
          href={detailsHref}
          onClick={onClick}
          className={styles.seeMore}
          aria-label={`Ver mais sobre ${product.name}`}
        >
          VEJA MAIS
        </Link>

        <motion.button
          type="button"
          className={isInCart ? styles.buyButtonAdded : styles.buyButton}
          onClick={handleBuy}
          disabled={isInCart}
          whileHover={reduceMotion || isInCart ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion || isInCart ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.12 }}
        >
          {isInCart ? "ADICIONADO AO CARRINHO" : "COMPRAR"}
        </motion.button>
      </div>
    </motion.article>
  );
}
