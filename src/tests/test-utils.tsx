import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import cartReducer from "@/store/cart/cart.slice";

type RootState = {
  cart: ReturnType<typeof cartReducer>;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  });
}

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: preloadedState as RootState | undefined,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

type ExtendedRenderOptions = Omit<RenderOptions, "queries"> & {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const queryClient = makeQueryClient();

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
