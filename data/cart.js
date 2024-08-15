export let cart;

loadFromStorage();
export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem('cart')) ?? [];
}

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function calculateCartQuantity() {
    // Assume cart is already populated in memory, do not overwrite it
    if (!cart || !Array.isArray(cart)) {
        cart = JSON.parse(localStorage.getItem('cart')) ?? [];
    }
    let quantity = 0;
    if(cart) {
        cart.forEach((item) => {
            quantity+= item.quantity;
        });
    }
    localStorage.setItem('quantity', quantity);
}

export function displayCartQuantity() {
    document.querySelector('.js-cart-quantity').innerHTML = localStorage.getItem('quantity') ?? 0;
}

/**
 * Add To Cart  
*/
export function addToCart(productId) {
    // Get the Quantity Selector Value
    let itemQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    let itemFound = cart.find(item => item.productId === productId);
    
    if(itemFound) {
        itemFound.quantity = itemFound.quantity + itemQuantity;
    } else {
        cart.push({
            productId, // destructed the productId
            quantity: itemQuantity,
        });
    }
    document.querySelector(`.js-add-to-cart-${productId}`).style.opacity='0.5';

    setTimeout(() => {
        document.querySelector(`.js-add-to-cart-${productId}`).style.opacity='0';
    }, 1000);
    
    saveToStorage();
    calculateCartQuantity();
    displayCartQuantity();
}

export function removeFromCart(productId) {
    if(cart) {
        cart = cart.filter(item => item.productId !== productId);
        saveToStorage();
        calculateCartQuantity();
        displayCartQuantityInCheckout();
    }
}

export function displayCartQuantityInCheckout() {
    document.querySelector('.return-to-home-link').innerHTML = (localStorage.getItem('quantity') ?? 0) + ' Items';
}