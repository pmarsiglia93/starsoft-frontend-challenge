import styles from "./CartItemRow.module.scss";
import type { CartItem } from "@/store/cart/cart.slice";
import { useAppDispatch } from "@/store/hooks";
import { decrease, increase, removeFromCart } from "@/store/cart/cart.slice";

type Props = {
  item: CartItem;
};

export function CartItemRow({ item }: Props) {
  const dispatch = useAppDispatch();

  return (
    <article className={styles.row}>
      <div className={styles.imageBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={item.imageUrl} alt={item.name} />
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>

        <div className={styles.meta}>
          <div className={styles.price}>{item.price.toFixed(2)} ETH</div>

          <div className={styles.qty}>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => dispatch(decrease(item.id))}
              aria-label="Diminuir quantidade"
            >
              −
            </button>

            <span className={styles.qtyValue}>{item.quantity}</span>

            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => dispatch(increase(item.id))}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.trash}
        onClick={() => dispatch(removeFromCart(item.id))}
        aria-label="Remover item"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3h6m-8 4h10m-9 0 1 14h6l1-14"
            stroke="var(--color-gray)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 11v7M14 11v7"
            stroke="var(--color-gray)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </article>
  );
}
