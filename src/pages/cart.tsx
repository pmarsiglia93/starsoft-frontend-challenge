import type { NextPage } from "next";
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

  // snapshot do total para mostrar no modal mesmo se limpar o carrinho
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
    // comportamento bem "Figma": finaliza e mostra estado final no botão
    setIsFinished(true);
    // limpa carrinho (se você preferir limpar só ao fechar, é só mover isso pro closeCheckout)
    dispatch(clearCart());
  }

  const isEmpty = items.length === 0;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link
            href="/"
            className={styles.backBtn}
            aria-label="Voltar para produtos"
          >
            <span className={styles.backIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="var(--color-white)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Voltar
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

            <aside className={styles.summary}>
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Itens</span>
                  <span className={styles.summaryValue}>{totalQty}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Total</span>
                  <span className={styles.summaryValue}>
                    {totalPrice.toFixed(2)} ETH
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
              </div>
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
