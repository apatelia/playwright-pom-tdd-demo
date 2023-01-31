import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { CheckoutCompletePage } from '../pages/checkout-complete-page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one-page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    // Login and go to Products page.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin(page, 'standard_user', 'secret_sauce');
});


test('Place an order @checkout', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);
    expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);

    await cartPage.doCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillCustomerInformation();
    await checkoutStepOnePage.doCheckout();

    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    expect(await checkoutStepTwoPage.getProductPrice(productName)).toEqual(productPrice);
    expect(await checkoutStepTwoPage.getProductQuantity(productName)).toEqual(productQuantity);

    await checkoutStepTwoPage.finishCheckout();

    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(checkoutCompletePage.thankYouHeading).toBeVisible();
});


test('Clicking `Back Home` button takes back to `Products` page @checkout', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);
    await productPage.addProductToCart(productName);
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.doCheckout();

    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillCustomerInformation();
    await checkoutStepOnePage.doCheckout();

    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await checkoutStepTwoPage.finishCheckout();

    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(checkoutCompletePage.backHomeButton).toBeEnabled();

    await checkoutCompletePage.backHomeButton.click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productPage.productHeading).toBeVisible();
});
