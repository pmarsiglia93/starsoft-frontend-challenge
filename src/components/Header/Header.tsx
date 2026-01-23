import Link from "next/link";
import styles from "./Header.module.scss";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalQuantity } from "@/store/cart/cart.selectors";

export function Header() {
  const totalQty = useAppSelector(selectCartTotalQuantity);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Starsoft - Home">
          starsoft
        </Link>

        <Link href="/cart" className={styles.cart} aria-label="Ir para o carrinho">
          <span className={styles.cartIcon} aria-hidden="true">
            {/* ícone simples (mochila/carrinho). Se quiser trocar depois por SVG do Figma, é só substituir aqui */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7.5a5 5 0 0 1 10 0V9h2a2 2 0 0 1 2 2l-1.2 9.5A2.5 2.5 0 0 1 19.32 23H4.68A2.5 2.5 0 0 1 2.2 20.5L1 11a2 2 0 0 1 2-2h2V7.5Z"
                stroke="var(--color-primary)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M8 9V7.5a4 4 0 1 1 8 0V9"
                stroke="var(--color-primary)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className={styles.cartCount}>{totalQty}</span>
        </Link>
      </div>
    </header>
  );
}
