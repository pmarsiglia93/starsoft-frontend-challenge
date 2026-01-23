import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Poppins } from "next/font/google";

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

  return (
    <div className={poppins.className}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Provider>
    </div>
  );
}
