import RootLayout from "@/layouts/Root";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";
import { store } from "./store";
import * as React from "react";
const Home = React.lazy(() => import("@/pages/Home"));
const Product = React.lazy(() => import("@/pages/Product"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/edit",
        element: <Product />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
