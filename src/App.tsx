import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Product } from "./pages/product";
import { Cart } from "./pages/cart";
import { Error } from "./pages/error";

import { Private } from "./routes/private";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home />
      }, 
      {
        path: '/dashboard',
        element: <Private><Dashboard /></Private> 
      },
      {
        path: '/dashboard/new',
        element: <Private><New /></Private> 
      },
      {
        path: '/product/:id',
        element: <Product />
      },
      {
        path: '/cart',
        element: <Private><Cart /></Private>
      },
      {
        path: '*',
        element: <Error />
      }
    ], 
  },

  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

])

export {router}