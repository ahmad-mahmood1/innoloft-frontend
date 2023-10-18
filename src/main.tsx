import RootLayout from "@/layouts/Root";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { store } from "./store";
import ErrorPage from "./pages/ErrorPage";

const Home = React.lazy(() => import("@/pages/Home"));
const Product = React.lazy(() => import("@/pages/Product"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/edit",
        element: <Product />,
      },
      { index: true, element: <Home /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
