import cartReducer, {
  addToCart,
  removeFromCart,
  increase,
  decrease,
  clearCart,
} from "./cart.slice";

describe("cart.slice", () => {
  const itemBase = {
    id: "1",
    name: "Produto Teste",
    imageUrl: "/img.png",
    price: 10,
  };

  it("addToCart adiciona e incrementa quantity se repetir", () => {
    let state = cartReducer(undefined, { type: "init" });

    state = cartReducer(state, addToCart(itemBase));
    expect(Object.keys(state.items)).toHaveLength(1);
    expect(state.items["1"].quantity).toBe(1);

    state = cartReducer(state, addToCart(itemBase));
    expect(Object.keys(state.items)).toHaveLength(1);
    expect(state.items["1"].quantity).toBe(2);
  });

  it("increase incrementa quantity", () => {
    let state = cartReducer(undefined, { type: "init" });
    state = cartReducer(state, addToCart(itemBase));

    state = cartReducer(state, increase("1"));
    expect(state.items["1"].quantity).toBe(2);
  });

  it("decrease decrementa e remove quando chega em 0", () => {
    let state = cartReducer(undefined, { type: "init" });
    state = cartReducer(state, addToCart(itemBase)); // qty=1

    state = cartReducer(state, decrease("1")); // qty=0 => remove
    expect(state.items["1"]).toBeUndefined();
    expect(Object.keys(state.items)).toHaveLength(0);
  });

  it("removeFromCart remove item por id", () => {
    let state = cartReducer(undefined, { type: "init" });
    state = cartReducer(state, addToCart(itemBase));

    state = cartReducer(state, removeFromCart("1"));
    expect(state.items["1"]).toBeUndefined();
  });

  it("clearCart zera o carrinho", () => {
    let state = cartReducer(undefined, { type: "init" });
    state = cartReducer(state, addToCart(itemBase));

    state = cartReducer(state, clearCart());
    expect(Object.keys(state.items)).toHaveLength(0);
  });
});
