import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/tests/test-utils";
import { ProductCard } from "./ProductCard";

describe("<ProductCard />", () => {
  it("renderiza e ao clicar em COMPRAR muda para ADICIONADO AO CARRINHO (disabled)", async () => {
    const user = userEvent.setup();

    const product: any = {
      id: 1,
      name: "Produto Teste",
      description: "Descrição do produto",
      price: 10,
      image: "/img.png",
    };

    renderWithProviders(<ProductCard product={product} />);

    const buyBtn = screen.getByRole("button", { name: /comprar/i });
    expect(buyBtn).toBeEnabled();

    await user.click(buyBtn);

    const addedBtn = await screen.findByRole("button", {
      name: /adicionado ao carrinho/i,
    });

    expect(addedBtn).toBeDisabled();
  });
});
