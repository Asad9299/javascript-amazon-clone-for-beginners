import { formatPrice } from "../scripts/utils/money.js"
class Product {
  
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getRatings() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getFormattedPrice() {
    return formatPrice(this.priceCents);
  }

  getExtraHTML() {
    return '';
  }
}

class Clothing extends Product {
    sizeChartLink;
    constructor(productDetails) {
      super(productDetails); // calls the constructor of the parent class.
      this.sizeChartLink = productDetails.sizeChartLink;
    }

    getExtraHTML() {
      return `<a href="${this.sizeChartLink}">Size Chart Link</a>`;
    }
}

// Fetch the List of Products from the Backend.
export let products = [];

/*
  The another way to make the ajax request is to use fetch. fetch() returns promise.
*/
export function productsFetch() {
  console.log('fetching products');

  const promise = fetch("https://supersimplebackend.dev/products")
  .then((response) => {
    return response.json();
  })
  .then( (productData) => {
    products = productData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });  
  });
  return promise;
}

/*
  One way to do ajax request is, XMLHttpRequest object.
*/
export function loadProducts(resolve) {
  console.log('loading products');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', "https://supersimplebackend.dev/products", true);

  xhr.addEventListener('load', () => {
      try {
          // Parse the response and map to your products array
          products = JSON.parse(xhr.responseText).map((productDetails) => {
              if (productDetails.type === 'clothing') {
                  return new Clothing(productDetails);
              }
              return new Product(productDetails);
          });
          resolve();  
      } catch (error) {
          console.error('Error while processing the response:', error);
      }
  });

  xhr.addEventListener('error', () => {
      console.error('Network error occurred during XHR request');
  });

  xhr.send();
}


export function loadCart(resolve) {
  console.log('loading cart');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', "https://supersimplebackend.dev/cart", true);

  xhr.addEventListener('load', () => {
      try {
          console.log(xhr.responseText);
          resolve();  
      } catch (error) {
          console.error('Error while processing the response:', error);
      }
  });

  xhr.addEventListener('error', () => {
      console.error('Network error occurred during XHR request');
  });

  xhr.send();
}