import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: Record<string, CartItem>;
};

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "quantity">>
    ) => {
      const item = action.payload;
      const existing = state.items[item.id];

      state.items[item.id] = existing
        ? { ...existing, quantity: existing.quantity + 1 }
        : { ...item, quantity: 1 };
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },

    increase: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items[id];
      if (!item) return;
      item.quantity += 1;
    },

    decrease: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items[id];
      if (!item) return;

      item.quantity -= 1;
      if (item.quantity <= 0) {
        delete state.items[id];
      }
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, removeFromCart, increase, decrease, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
