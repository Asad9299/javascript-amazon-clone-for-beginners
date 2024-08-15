import { renderCartSummary } from "./checkout/cartSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

new Promise((resolve, reject) => {
    try {
      loadProducts(() => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  }).then(() => {
    renderCartSummary();
    renderPaymentSummary();

  }).catch((error) => {
    console.error('An error occurred:', error);
  });