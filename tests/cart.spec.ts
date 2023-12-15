import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    await test.step(`Login and go to Products page`, async () => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.doLogin('standard_user', 'secret_sauce');
    }, { box: true });
});


test('Verify product details from the cart @cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);

    await test.step(`User adds '1' quantity of 'Sauce Labs Backpack' to cart, having price of '$29.99'`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    await test.step(`Product details on cart page should match with quantity of '1' and price of '$29.99'`, async () => {
        const cartPage = new CartPage(page);
        expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);
        expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);
    }, { box: true });
});

test('Remove a product from the cart @cart', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);

    await test.step(`User adds 'Sauce Labs Bike Light' to cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    const cartPage = new CartPage(page);
    
    await test.step(`Product count should be '1', and should be visible on the cart menu in header`, async () => {
        const cartItemCount = await cartPage.header.getCartItemCount();
        expect(cartItemCount).toEqual(1);
    }, { box: true });
    

    await test.step(`Remove 'Sauce Labs Bike Light' product from the cart`, async () => {
        await cartPage.removeProductFromCart(productName);
    }, { box: true });

    await test.step(`Product count should be '0', and '1' should not be visible on the cart menu in header`, async () => {
        const cartItemCount = await cartPage.header.getCartItemCount();
        expect(cartItemCount).toEqual(0);
    }, { box: true });
});

test('Continue Shopping button takes back to Products page @cart', async ({ page }) => {
    const productPage = new ProductsPage(page);
    
    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    await test.step(`User clicks on 'Continue Shopping' button on the cart page`, async () => {
        const cartPage = new CartPage(page);
        await cartPage.doContinueShopping();
    }, { box: true });

    await test.step(`User should be redirected back to Products page`, async () => {
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(productPage.productHeading).toBeVisible();
    }, { box: true });
});

test('Clicking `Checkout` button starts checkout @cart', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);

    await test.step(`User adds a product to the cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    await test.step(`User clicks on 'Checkout' button on the cart page`, async () => {
        const cartPage = new CartPage(page);
        await cartPage.doCheckout();
    }, { box: true });

    await test.step(`User should land on the checkout page`, async () => {
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    }, { box: true });
});
