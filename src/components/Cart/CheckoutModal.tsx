import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./CheckoutModal.module.scss";

type Props = {
  open: boolean;
  finished: boolean;
  qty: number;
  total: number;
  onClose: () => void;
  onFinish: () => void;
};

export function CheckoutModal({ open, finished, qty, total, onClose, onFinish }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            // fecha clicando fora
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
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
