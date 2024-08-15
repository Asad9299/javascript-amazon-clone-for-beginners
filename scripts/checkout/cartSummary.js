import { calculateCartQuantity, cart, displayCartQuantityInCheckout } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatPrice } from "../utils/money.js";
import { removeFromCart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js"; 
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";

let cartSummaryHtml = '';
let productId = 0;

export function renderCartSummary() {
    cart.forEach(item => {
        const productDetails = products.find(product => product.id === item.productId);
        
        cartSummaryHtml += `<div class="cart-item-container-${productDetails.id}"><div class="delivery-date js-delivery-date-${productDetails.id}"></div><div class="cart-item-details-grid"><img class="product-image" src="${productDetails.image}"><div class="cart-item-details"><div class="product-name">${productDetails.name}</div><div class="product-price">$${formatPrice(productDetails.priceCents)}</div><div class="product-quantity"><span>Quantity:<span class="quantity-label">$${item.quantity}</span></span><span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${item.productId}>Delete</span></div></div><div class="delivery-options"><div class="delivery-options-title">Choose a delivery option:</div>${deliveryOptionsHTML(productDetails.id)}</div></div></div></div>`;
    });
    
    function deliveryOptionsHTML(productId) {
        const deliveryDate = dayjs();
        let deliveryOptionsHTML = '';
        deliveryOptions.forEach((deliveryOption) => {
            const optionDate = deliveryDate.add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM DD');
    
            const optionPrice = deliveryOption.priceCents === 0 ? 'FREE SHIPPING' : `$ ${formatPrice(deliveryOption.priceCents)}`;

            const isChecked = deliveryOption.id == '1' ? 'checked' : '';
            
            deliveryOptionsHTML+= `<div class="delivery-option"><input type="radio" class="delivery-option-input js-delivery-option-input" name="delivery-option-${productId}" data-product-id=${productId} data-delivery-option-id=${deliveryOption.id} ${isChecked}><div><div class="delivery-option-date">${optionDate}</div><div class="delivery-option-price js-delivery-option-price-${productId}">${optionPrice}</div></div></div>`;
        });
        return deliveryOptionsHTML;
    }
    
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;
    
    document.querySelectorAll('.js-delivery-option-input').forEach((deliveryOptionInput) => {
        const updateProductIdAndRenderDate = () => {
            productId = deliveryOptionInput.dataset.productId;
            renderDeliveryDate();
        };
        
        updateProductIdAndRenderDate();
        
        deliveryOptionInput.addEventListener('change', updateProductIdAndRenderDate);
    });

    function renderDeliveryDate() {
        const selectedOption = document.querySelector(`input[name="delivery-option-${productId}"]:checked`);
        
        if (selectedOption) {
            const optionPriceElement = selectedOption.closest('.delivery-option').querySelector(`.js-delivery-option-price-${productId}`);
            if(optionPriceElement.innerText === 'FREE SHIPPING') {
                document.querySelector(`.js-delivery-date-${productId}`).innerHTML = `Delivery Date: ${dayjs().add(7, 'days').format('dddd, MMMM DD')}`; 
            } else if(optionPriceElement.innerText === '$ 4.99') {
                document.querySelector(`.js-delivery-date-${productId}`).innerHTML = `Delivery Date: ${dayjs().add(4, 'days').format('dddd, MMMM DD')}`; 
            } else {
                document.querySelector(`.js-delivery-date-${productId}`).innerHTML = `Delivery Date: ${dayjs().add(2, 'days').format('dddd, MMMM DD')}`;
            }
        }
    }
    
    document.querySelectorAll('.js-delete-quantity-link').forEach((deleteButton) => {
        deleteButton.addEventListener('click', ()=>{
            removeFromCart(deleteButton.dataset.productId);
            document.querySelector(`.cart-item-container-${deleteButton.dataset.productId}`).remove();

            renderPaymentSummary();
        })
    });
    calculateCartQuantity();
    displayCartQuantityInCheckout();
}