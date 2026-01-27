import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import CartPage from "@/pages/cart";
import cartReducer from "@/store/cart/cart.slice";

type CartItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
};

function makeStoreWithCart(items: CartItem[]) {

  const store = configureStore({
    reducer: { cart: cartReducer },
  });

  for (const item of items) {
    store.dispatch({
      type: "cart/addToCart",
      payload: item,
    });
  }

  return store;
}

function renderCartWithStore(store: ReturnType<typeof makeStoreWithCart>) {
  return render(
    <Provider store={store}>
      <CartPage />
    </Provider>,
  );
}

describe("CartPage", () => {
  it("renderiza total, abre modal e ao finalizar compra limpa carrinho e mostra estado vazio", async () => {
    const user = userEvent.setup();

    const store = makeStoreWithCart([
      {
        id: 1,
        name: "Item 1",
        description: "desc 1",
        image: "/img.png",
        price: 10,
      },
      {
        id: 2,
        name: "Item 2",
        description: "desc 2",
        image: "/img.png",
        price: 10,
      },
    ]);

    renderCartWithStore(store);

    const summary =
      (document.querySelector("aside.summary") as HTMLElement | null) ??
      (document.querySelector('[data-testid="cart-summary"]') as HTMLElement | null) ??
      (document.querySelector("aside") as HTMLElement | null);

    expect(summary).toBeTruthy();

    const summaryScope = within(summary as HTMLElement);

    expect(summaryScope.getByText(/^total$/i)).toBeInTheDocument();
    expect(summaryScope.getByText(/20\s*eth/i)).toBeInTheDocument();

    const finishBtnInSummary = summaryScope.getByRole("button", {
      name: /finalizar compra/i,
    });
    await user.click(finishBtnInSummary);

    const modal = await screen.findByRole("dialog", { name: /checkout/i });
    const modalScope = within(modal);

    expect(modalScope.getByText(/checkout/i)).toBeInTheDocument();

    const finishBtnInModal = modalScope.getByRole("button", {
      name: /finalizar compra/i,
    });
    await user.click(finishBtnInModal);

    expect(
      await screen.findByText(/sua mochila está vazia/i),
    ).toBeInTheDocument();
  });
});
