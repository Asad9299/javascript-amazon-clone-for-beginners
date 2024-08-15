import { cart, addToCart, loadFromStorage } from "../../data/cart.js"

describe('Add to cart: Test Suite', () => {
    it('checks if product already exists into the cart', () => {
        spyOn(localStorage, 'setItem');

        const mockElement = { value: '1' };
        spyOn(document, 'querySelector').and.returnValue(mockElement);

        spyOn(localStorage, 'getItem').and.callFake(()=> {
            return JSON.stringify([{
                productId : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity : 1       
            }]);
        });
        loadFromStorage();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart[0].quantity).toEqual(2);
    });

    it('adds the new product to the cart', () => {
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(()=> {
            return JSON.stringify([]);
        });

        loadFromStorage();

        // Mock querySelector to return an element with a specific value
        const mockElement = { value: '1' };
        spyOn(document, 'querySelector').and.returnValue(mockElement);

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart[0].quantity).toEqual(1);
    });
});
