import { addToCart, displayCartQuantity } from "../data/cart.js";
import { products, loadCart, productsFetch } from "../data/products.js";

/*
  A better way to handle asynchronus code.
*/ 
async function loadPage() {
  await productsFetch();
  
  await new Promise((resolve) => {
      loadCart(() => {
        resolve();  // Resolve when cart is loaded
      });
  });
  renderProductsGrid();
}
loadPage();

// Promise.all([
//   productsFetch(),
//   new Promise((resolve, reject) => {
//     try {
//       loadCart(() => {
//         resolve();  // Resolve when cart is loaded
//       });
//     } catch (error) {
//       reject(error);
//     }
//   })
// ])
// .then(() => {
//   // This block will run once all promises in Promise.all are resolved
//   renderProductsGrid();
// })
// .catch((error) => {
//   console.error('An error occurred:', error);
// });

function renderProductsGrid() {
    let productHtml = '';
    /**
     * Render Product List Handling
    */
    products.forEach((product) => {
        productHtml += `<div class="product-container"><div class="product-image-container"><img class="product-image" src="${product.image}"></div><div class="product-name limit-text-to-2-lines">${product.name}</div><div class="product-rating-container"><img class="product-rating-stars" src="${product.getRatings()}"><div class="product-rating-count link-primary">${product.rating.count}</div></div><div class="product-priceCentsCents">$${product.getFormattedPrice()}</div><div class="product-quantity-container"><select class="js-quantity-selector-${product.id}"><option selected="selected" value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></div><div class="product-spacer"></div><div>${product.getExtraHTML()}</div><div class="added-to-cart js-add-to-cart-${product.id}"><img src="images/icons/checkmark.png"> Added</div><button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button></div>`;
    });

    // Show the List of Products
    document.querySelector('.products-grid').innerHTML = productHtml;

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            
            // Add the product to the Cart
            addToCart(productId); 
        });
    });

    // Display Cart Quantity in Header
    displayCartQuantity();
}
