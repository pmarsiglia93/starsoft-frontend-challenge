import React from "react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CartPage from "@/pages/cart";
import { makeStore, renderWithProviders } from "@/tests/test-utils";

describe("CartPage", () => {
  it("renderiza totais, abre modal e ao finalizar compra limpa carrinho e mostra estado vazio", async () => {
    const user = userEvent.setup();

    // ✅ pega o tipo do preloadedState direto do makeStore (sem importar RootState)
    type PreloadedState = NonNullable<Parameters<typeof makeStore>[0]>;

    const preloadedState = {
      cart: {
        items: {
          "1": {
            id: "1",
            name: "Produto Teste",
            imageUrl: "/img.png",
            price: 10,
            quantity: 2,
          },
        },
      },
    } satisfies PreloadedState;

    const store = makeStore(preloadedState);

    renderWithProviders(<CartPage />, { store });

    // Item renderizado
    expect(screen.getByText(/produto teste/i)).toBeInTheDocument();

    // ✅ Em vez de procurar "2" solto, valida especificamente dentro do summary
    const summary =
      document.querySelector("aside.summary") ??
      document.querySelector("aside");
    expect(summary).toBeTruthy();

    const summaryScope = within(summary as HTMLElement);

    // Linha "Itens" => valor "2"
    const itemsLabel = summaryScope.getByText(/^itens$/i);
    const itemsRow = itemsLabel.closest("div");
    expect(itemsRow).toBeTruthy();
    expect(within(itemsRow as HTMLElement).getByText("2")).toBeInTheDocument();

    // Linha "Total" => valor "20.00 ETH" (com regex por causa de quebra/space)
    const totalLabel = summaryScope.getByText(/^total$/i);
    const totalRow = totalLabel.closest("div");
    expect(totalRow).toBeTruthy();
    expect(
      within(totalRow as HTMLElement).getByText(/20\.00\s*ETH/i),
    ).toBeInTheDocument();

    // Abre modal
    const openBtn = screen.getByRole("button", { name: /finalizar compra/i });
    await user.click(openBtn);

    // Modal aberto
    const dialog = await screen.findByRole("dialog", { name: /checkout/i });
    expect(dialog).toBeInTheDocument();

    // Finaliza compra dentro do modal
    const finishInsideModal = within(dialog).getByRole("button", {
      name: /finalizar compra/i,
    });
    await user.click(finishInsideModal);

    // Página deve mostrar estado vazio após clearCart
    expect(
      await screen.findByText(/sua mochila está vazia/i),
    ).toBeInTheDocument();

    // Store realmente limpa
    expect(Object.keys(store.getState().cart.items)).toHaveLength(0);
  });
});
