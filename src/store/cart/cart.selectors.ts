import type { RootState } from "@/store";

export const selectCartItemsMap = (state: RootState) => state.cart.items;

export const selectCartItemsArray = (state: RootState) =>
  Object.values(state.cart.items);

export const selectCartTotalQuantity = (state: RootState) =>
  Object.values(state.cart.items).reduce((acc, item) => acc + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState) =>
  Object.values(state.cart.items).reduce((acc, item) => acc + item.price * item.quantity, 0);
