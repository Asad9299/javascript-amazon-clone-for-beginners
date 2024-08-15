import { products, productsFetch } from "./products.js";
import { formatPrice } from "../scripts/utils/money.js";
import { formatTime } from "../scripts/utils/time.js";
export let orders = JSON.parse(localStorage.getItem('orders')) ?? [];

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function displayCartQuantity() {
    document.querySelector('.js-cart-quantity').innerHTML = localStorage.getItem('quantity') ?? 0;
}

export async function loadOrders() {    
  const orders = JSON.parse(localStorage.getItem('orders')) ?? [];

  let orderHTML = '';
  for (const order of orders) {
    orderHTML += `<div class="order-header">
      <div class="order-header-left-section">
        <div class="order-date">
          <div class="order-header-label">Order Placed:</div>
          <div>${formatTime(order.orderTime)}</div>
        </div>
        <div class="order-total">
          <div class="order-header-label">Total:</div>
          <div>$${formatPrice(order.totalCostCents)}</div>
        </div>
      </div>

      <div class="order-header-right-section">
        <div class="order-header-label">Order ID:</div>
        <div>${order.id}</div>
      </div>
    </div>
  ${await renderOrderedProducts(order)}`;
};    
document.querySelector('.js-order-container').innerHTML = orderHTML;
}

async function renderOrderedProducts(order) {
  let orderedProductHTML = '';

  for (const productObj of order.products) {
    const product = await fetchedProductDetails(productObj.productId);
    orderedProductHTML += `<div class="order-details-grid">
      <div class="product-image-container">
        <img src="${product.image}">
      </div>
      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${formatTime(productObj.estimatedDeliveryTime)}
        </div>
        <div class="product-quantity">
          Quantity: ${productObj.quantity}
        </div>
      </div>
    </div>`;
  }

  return orderedProductHTML;
}


async function fetchedProductDetails(productId) {
  await productsFetch();
  let fetchedProductDetails;
  fetchedProductDetails = products.find( product => {
    return product.id === productId;
  });
  return fetchedProductDetails;
}