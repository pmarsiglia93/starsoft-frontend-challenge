import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/tests/test-utils";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/features/products/products.types"; // ou products.types (confere seu caminho)

describe("<ProductCard />", () => {
  it("renderiza e ao clicar em COMPRAR muda para ADICIONADO AO CARRINHO (disabled)", async () => {
    const user = userEvent.setup();

    const product: Product = {
      id: 1,
      name: "Produto Teste",
      description: "Descrição do produto",
      price: "10.00",
      image: "/img.png",
      createdAt: "2025-01-01T00:00:00.000Z",
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
