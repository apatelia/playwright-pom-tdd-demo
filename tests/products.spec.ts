import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    // Login and go to Products page.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin('standard_user', 'secret_sauce');
});


test('Add a product to the cart @products', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);

    const cartItemCount = await productPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);
});

test('Add and then remove a product to/from the cart @products', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);

    const cartItemCount = await productPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);

    await productPage.removeProductFromCart(productName);
    expect(productPage.header.cartItemCount).not.toBeNull();
});

test('Log out should work', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await productPage.header.doLogout();

    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
});
