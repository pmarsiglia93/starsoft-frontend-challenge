import { useMemo } from "react";
import styles from "./ProductCard.module.scss";
import type { Product } from "@/features/products/products.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cart/cart.slice";
import { selectCartItemsMap } from "@/store/cart/cart.selectors";
import { mapProductToCartItem } from "@/store/cart/cart.mappers";

type Props = {
  product: Product;
  onClick?: () => void;
};

export function ProductCard({ product, onClick }: Props) {
  const dispatch = useAppDispatch();
  const itemsMap = useAppSelector(selectCartItemsMap);

  const id = String(product.id);
  const isInCart = Boolean(itemsMap[id]);

  const priceEth = useMemo(() => {
    const n = Number(product.price);
    if (Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  }, [product.price]);

  function handleBuy(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation(); // opcional (bom quando o card navega)
    if (isInCart) return;
    dispatch(addToCart(mapProductToCartItem(product)));
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.media}
        onClick={onClick}
        aria-label={`Abrir ${product.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={product.image} alt={product.name} />
      </button>

      <div className={styles.content}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.priceRow}>
          <span className={styles.ethIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l7 10-7 4-7-4 7-10Z" fill="var(--color-white)" opacity="0.9" />
              <path d="M12 22l7-10-7 4-7-4 7 10Z" fill="var(--color-white)" opacity="0.6" />
            </svg>
          </span>
          <span className={styles.price}>{priceEth} ETH</span>
        </div>

        <button
          type="button"
          className={isInCart ? styles.buyButtonAdded : styles.buyButton}
          onClick={handleBuy}
          disabled={isInCart} // se você quiser “clicável mas sem ação”, remova isso
        >
          {isInCart ? "ADICIONADO AO CARRINHO" : "COMPRAR"}
        </button>
      </div>
    </article>
  );
}
