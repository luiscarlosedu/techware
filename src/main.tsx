import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import CupomProvider from './contexts/CupomContext'
import CartProvider from './contexts/CartContext'

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import {Toaster} from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster 
    position="top-center"
    reverseOrder={false}
    containerStyle={{
      position: 'sticky',
      zIndex: 9999,
    }}
    />
    <AuthProvider>
      <CartProvider>
        <CupomProvider>
          <RouterProvider router={router} />
        </CupomProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
