import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export const selectCartItemsMap = (state: RootState) => state.cart.items;

export const selectCartItemsArray = createSelector([selectCartItemsMap], (items) =>
  Object.values(items)
);

export const selectCartTotalQuantity = createSelector([selectCartItemsArray], (items) =>
  items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector([selectCartItemsArray], (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);
