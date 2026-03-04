import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { router } from "./app/routes";

import { ToastProvider } from "./store/toastStore";
import { AuthProvider } from "./store/authStore";
import { ShopProvider } from "./store/shopStore";
import { ProductProvider } from "./store/productStore";
import { CartProvider } from "./store/cartStore";
import { OrderProvider } from "./store/orderStore";
import { ReportProvider } from "./store/reportStore";
import { PaymentProvider } from "./store/paymentStore";
import { AdminProvider } from "./store/adminStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <ShopProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <ReportProvider>
                    <PaymentProvider>
                      <RouterProvider router={router} />
                    </PaymentProvider>
                  </ReportProvider>
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </ShopProvider>
        </AdminProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);