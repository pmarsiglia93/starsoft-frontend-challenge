// src/components/Cart/CheckoutModal.tsx
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./CheckoutModal.module.scss";

type Props = {
  open: boolean;
  finished: boolean;
  qty: number;
  total: number;
  onClose: () => void;
  onFinish: () => void;
};

export function CheckoutModal({
  open,
  finished,
  qty,
  total,
  onClose,
  onFinish,
}: Props) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // ESC + foco + scroll lock
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // foca o modal quando abre
    const t = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          aria-hidden={false}
        >
          <motion.div
            ref={dialogRef}
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            tabIndex={-1}
          >
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Fechar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="var(--color-white)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h2 className={styles.title}>Checkout</h2>

            <div className={styles.box}>
              <div className={styles.row}>
                <span className={styles.label}>Itens</span>
                <span className={styles.value}>{qty}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Total</span>
                <span className={styles.value}>{total.toFixed(2)} ETH</span>
              </div>
            </div>

            <button
              type="button"
              className={finished ? styles.finishBtnDone : styles.finishBtn}
              onClick={onFinish}
              disabled={finished}
            >
              {finished ? "COMPRA FINALIZADA!" : "FINALIZAR COMPRA"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
