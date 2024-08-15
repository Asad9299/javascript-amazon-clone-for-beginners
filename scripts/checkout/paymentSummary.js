import { cart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { products } from "../../data/products.js";
import { formatPrice } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
    let totalProductPrice = 0;
    let totalShippingPrice = 0;
    let totalWithoutTax = 0;
    let totalWithTax = 0;
    let finalTotal = 0;

    function updatePaymentSummaryHTML() {
        const quantity = localStorage.getItem('quantity') ?? 0;
        const productPrice = formatPrice(totalProductPrice);
        const shippingPrice = formatPrice(totalShippingPrice);
        const withoutTax = formatPrice(totalWithoutTax);
        const estimatedTax = formatPrice(calculateEstimatedTax(totalWithoutTax));
        const orderTotal = formatPrice(finalTotal);

        const paymentSummaryHTML = `
            <div class="payment-summary-title">Order Summary</div>
            <div class="payment-summary-row">
                <div>Items (${quantity}):</div>
                <div class="payment-summary-money">${productPrice}</div>
            </div>
            <div class="payment-summary-row">
                <div>Shipping & handling:</div>
                <div class="payment-summary-money">${shippingPrice}</div>
            </div>
            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">${withoutTax}</div>
            </div>
            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">${estimatedTax}</div>
            </div>
            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">${orderTotal}</div>
            </div>
            <button class="place-order-button button-primary js-place-order-button">Place your order</button>`;

        document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

        attachPlaceOrderButtonListener();// Re-attach the event listener
    }

    function calculateProductPrice() {
        totalProductPrice = 0;
        cart.forEach((item) => {
            const product = products.find(product => item.productId === product.id);
            totalProductPrice += item.quantity * product.priceCents;
        });
        updatePaymentSummaryHTML();
    }

    function calculateShippingPrice() {
         
        function calculateInitialShipping() {
            totalShippingPrice = 0;
            document.querySelectorAll(`input[name^="delivery-option-"]:checked`).forEach(selectedOption => {
                const deliveryOptionId = selectedOption.dataset.deliveryOptionId;
                const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
                totalShippingPrice += deliveryOption.priceCents;
            });
            updatetotalProductPrice();
        }

        calculateInitialShipping(); // Calculate initially selected option

        document.querySelectorAll('.js-delivery-option-input').forEach((deliveryOptionInput) => {
            deliveryOptionInput.addEventListener('change', () => {
                calculateInitialShipping();
            });
        });
    }

    function updatetotalProductPrice() {
        totalWithoutTax = totalProductPrice + totalShippingPrice;
        totalWithTax = calculateEstimatedTax(totalWithoutTax);
        finalTotal = totalWithoutTax + totalWithTax;
        updatePaymentSummaryHTML();
    }

    function calculateEstimatedTax(totalWithoutTax) {
        return (totalWithoutTax * 10) / 100;
    }

    calculateProductPrice();
    calculateShippingPrice();
    updatetotalProductPrice();

    function attachPlaceOrderButtonListener() {
        document.querySelector('.js-place-order-button')
            .addEventListener('click', async () => {
        try {
            const response =  await fetch("https://supersimplebackend.dev/orders", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: JSON.parse(localStorage.getItem('cart')) ?? []
                })
            });
            const order = await response.json();
            addOrder(order);
        } catch (error) {
            console.log('error:', error);
        }
        window.location.href = 'orders.html';
    });
}
}
