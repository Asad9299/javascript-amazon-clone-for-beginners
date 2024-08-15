import { displayCartQuantity, loadOrders } from "../data/orders.js";

localStorage.removeItem('cart');
localStorage.removeItem('quantity');

displayCartQuantity();

loadOrders();