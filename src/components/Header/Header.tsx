import Link from "next/link";
import Image from "next/image";

import styles from "./Header.module.scss";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalQuantity } from "@/store/cart/cart.selectors";

export function Header() {
  const totalQty = useAppSelector(selectCartTotalQuantity);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Starsoft - Home">
          <Image
            src="/assets/icons/starsoft-logo.svg"
            alt="Starsoft"
            width={101}
            height={38}
            priority
          />
        </Link>

        <Link
          href="/cart"
          className={styles.cart}
          aria-label={`Ir para o carrinho. Itens: ${totalQty}`}
        >
          <span className={styles.cartIcon} aria-hidden="true">
            <Image
              src="/assets/icons/bag-cart.svg"
              alt=""
              width={33}
              height={33}
              priority
            />
          </span>

          <span className={styles.cartCount}>{totalQty}</span>
        </Link>
      </div>
    </header>
  );
}
