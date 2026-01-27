import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { store } from "@/store";
import { createQueryClient } from "@/lib/queryClient";

import "@/styles/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <div className={poppins.className}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.asPath}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ minHeight: "100vh" }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </QueryClientProvider>
      </Provider>
    </div>
  );
}
