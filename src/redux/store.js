import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const savedCart = localStorage.getItem("shopzoneCart");

const initialCart = savedCart
  ? JSON.parse(savedCart)
  : {
      items: [],
    };

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: initialCart,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    "shopzoneCart",
    JSON.stringify(store.getState().cart)
  );
});