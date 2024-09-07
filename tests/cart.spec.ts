import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.describe('Cart Feature Tests', { tag: [ `@cart` ] }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    // step: Given I am on login page
    await loginPage.goto();

    // step: When I try to login with "standard_user" as username and "secret_sauce" as password
    await loginPage.doLogin('standard_user', 'secret_sauce');

    // step: Then I should be on Products page
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Verify product details from the cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // step: When I add "Sauce Labs Backpack" to the cart
    await productPage.addProductToCart(productName);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    // step: Then price of the "Sauce Labs Backpack" in cart must match "$29.99"
    expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);

    // step: And quantity of the "Sauce Labs Backpack" in cart must match 1
    expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);
  });

  test('Remove a product from the cart', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // step: When I add "Sauce Labs Bike Light" to the cart
    await productPage.addProductToCart(productName);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    // step: And quantity of the "Sauce Labs Bike Light" in cart must match 1
    const cartItemCount = await cartPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);

    // step: When I remove "Sauce Labs Bike Light" from the cart
    await cartPage.removeProductFromCart(productName);

    // step: Then the cart item badge must not be displayed
    const itemCount = await cartPage.header.getCartItemCount();
    expect(itemCount).toEqual(0);
  });

  test('Continue Shopping button takes back to Products page', { tag: [ `@continue_shopping` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    // step: When I click on the Continue Shopping button
    const cartPage = new CartPage(page);
    await cartPage.doContinueShopping();

    // step: Then I should be on Products page
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productPage.productHeading).toBeVisible();
  });

  test('Clicking `Checkout` button starts checkout', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);

    // step: When I add "Sauce Labs Fleece Jacket" to the cart
    await productPage.addProductToCart(productName);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    // step: When I click on the Checkout button
    const cartPage = new CartPage(page);
    await cartPage.doCheckout();

    // step: Then I should be on "Your Information" page
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });
});
