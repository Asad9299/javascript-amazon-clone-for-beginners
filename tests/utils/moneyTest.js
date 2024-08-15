import { formatPrice } from "../../scripts/utils/money.js";

describe('Format Price: Test Suite', () => {
    // test case 1
    it('Testing formatPrice(2500)', ()=> {
        expect(formatPrice(2500)).toEqual('25.00');
    });

    // test case 2
    it('Testing formatPrice(0)', ()=> {
        expect(formatPrice(0)).toEqual('0.00');
    });

    // test case 3
    it('Testing formatPrice(2000.5)', ()=> {
        expect(formatPrice(2000.5)).toEqual('20.01');
    });
});