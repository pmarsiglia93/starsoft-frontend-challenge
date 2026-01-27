import Image from "next/image";
import styles from "./CartItemRow.module.scss";
import type { CartItem } from "@/store/cart/cart.slice";
import { useAppDispatch } from "@/store/hooks";
import { decrease, increase, removeFromCart } from "@/store/cart/cart.slice";

type Props = {
  item: CartItem;
};

export function CartItemRow({ item }: Props) {
  const dispatch = useAppDispatch();

  // tenta pegar description sem quebrar caso não exista no type atual
  const description =
    (item as unknown as { description?: string }).description ??
    "Redesigned from scratch and completely revised.";

  return (
    <article className={styles.row}>
      <div className={styles.imageBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={item.imageUrl} alt={item.name} />
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.description}>{description}</div>

        <div className={styles.meta}>
          <div className={styles.price}>
            <span className={styles.ethIcon} aria-hidden="true">
              <Image
                src="/assets/icons/eth-logo.svg"
                alt=""
                width={29}
                height={29}
              />
            </span>
            <span>{item.price.toFixed(0)} ETH</span>
          </div>

          <div className={styles.qty} aria-label="Quantidade">
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
        <Image
          src="/assets/icons/delete.svg"
          alt="Remover"
          width={43}
          height={43}
        />
      </button>
    </article>
  );
}
