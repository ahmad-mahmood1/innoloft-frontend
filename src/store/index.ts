import { configureStore } from "@reduxjs/toolkit";
import { parentApi } from "./parentApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [parentApi.reducerPath]: parentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(parentApi.middleware),
});

setupListeners(store.dispatch);
