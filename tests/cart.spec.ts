import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    // Login and go to Products page.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin('standard_user', 'secret_sauce');
});


test('Verify product details from the cart @cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);
    expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);
});

test('Remove a product from the cart @cart', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    
    const cartItemCount = await cartPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);

    await cartPage.removeProductFromCart(productName);

    expect(cartPage.header.cartItemCount).not.toBeNull();
});

test('Continue Shopping button takes back to Products page @cart', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.doContinueShopping();

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productPage.productHeading).toBeVisible();
});

test('Clicking `Checkout` button starts checkout @cart', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.doCheckout();

    await expect(page).toHaveURL(/.*checkout-step-one.html/);
});
