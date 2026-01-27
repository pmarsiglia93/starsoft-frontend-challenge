import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Header } from "@/components/Header/Header";
import styles from "@/styles/Cart.module.scss";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItemsArray,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "@/store/cart/cart.selectors";
import { clearCart } from "@/store/cart/cart.slice";

import { CartItemRow } from "@/components/Cart/CartItemRow";
import { CheckoutModal } from "@/components/Cart/CheckoutModal";

const CartPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItemsArray);
  const totalQty = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const snapshot = useMemo(() => {
    return {
      qty: totalQty,
      total: totalPrice,
    };
  }, [totalQty, totalPrice]);

  function openCheckout() {
    setIsFinished(false);
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    setIsCheckoutOpen(false);
    setIsFinished(false);
  }

  function handleFinishPurchase() {
    setIsFinished(true);
    dispatch(clearCart());
  }

  const isEmpty = items.length === 0;

  const totalEthText = totalPrice.toFixed(0); 

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link
            href="/"
            className={styles.backBtn}
            aria-label="Voltar para produtos"
            title="Voltar"
          >
            <Image
              src="/assets/icons/back.svg"
              alt="Voltar"
              className={styles.backIcon}
              width={60}
              height={60}
              priority
            />
          </Link>

          <h1 className={styles.title}>Mochila de Compras</h1>
        </div>

        {isEmpty ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Sua mochila está vazia</p>
            <p className={styles.emptyText}>
              Volte para a vitrine e adicione alguns produtos.
            </p>
            <Link className={styles.emptyCta} href="/">
              Ir para produtos
            </Link>
          </div>
        ) : (
          <div className={styles.content}>
            <section className={styles.items}>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </section>

            <aside className={styles.summary} data-testid="cart-summary">
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL</span>

                <span className={styles.totalValue}>
                  <span className={styles.totalEthIcon} aria-hidden="true">
                    <Image
                      src="/assets/icons/eth-logo.svg"
                      alt=""
                      width={29}
                      height={29}
                    />
                  </span>

                  {totalEthText} ETH
                </span>
              </div>

              <button
                type="button"
                className={styles.finishBtn}
                onClick={openCheckout}
                disabled={isEmpty}
              >
                FINALIZAR COMPRA
              </button>
            </aside>
          </div>
        )}
      </main>

      <CheckoutModal
        open={isCheckoutOpen}
        finished={isFinished}
        qty={snapshot.qty}
        total={snapshot.total}
        onClose={closeCheckout}
        onFinish={handleFinishPurchase}
      />
    </div>
  );
};

export default CartPage;
