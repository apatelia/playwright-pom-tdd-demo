import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { CheckoutCompletePage } from '../pages/checkout-complete-page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one-page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.describe('Checkout Feature Tests', { tag: [ `@checkout` ] }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    // step: Given I am on login page
    await loginPage.goto();

    // step: When I try to login with "standard_user" as username and "secret_sauce" as password
    await loginPage.doLogin('standard_user', 'secret_sauce');

    // step: Then I should be on Products page
    await expect(page).toHaveURL(/.*inventory.html/);
  });


  test('Place an order', { tag: [ `@order` ] }, async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);

    // step: When I add "Sauce Labs Backpack" to the cart
    await productPage.addProductToCart(productName);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    const cartPage = new CartPage(page);

    // step: Then Product price on the cart page, should match with price of the product added
    expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);

    // step: Then Product quantity on the cart page, should match with quantity of the product added
    expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);

    // step: When I start checkout
    await cartPage.doCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // step: And I fill customer information and continue with checkout
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillCustomerInformation();
    await checkoutStepOnePage.doCheckout();

    // step: Then I verify product details on the checkout summary page and complete the checkout
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    expect(await checkoutStepTwoPage.getProductPrice(productName)).toEqual(productPrice);
    expect(await checkoutStepTwoPage.getProductQuantity(productName)).toEqual(productQuantity);
    await checkoutStepTwoPage.finishCheckout();

    // step: Then I am greeted with a 'Thank You' message upon completing the checkout
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(checkoutCompletePage.thankYouHeading).toBeVisible();
  });


  test('Clicking `Back Home` button takes back to `Products` page', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);

    // step: When I add "Sauce Labs Backpack" to the cart
    await productPage.addProductToCart(productName);

    // step: Then I go to the cart page
    await productPage.header.goToCart();

    // step: When I start checkout
    const cartPage = new CartPage(page);
    await cartPage.doCheckout();

    // step: And I fill customer information and continue with checkout
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillCustomerInformation();
    await checkoutStepOnePage.doCheckout();

    // step: When I complete checkout
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await checkoutStepTwoPage.finishCheckout();

    // step: And I click on 'Back To Home' button
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(checkoutCompletePage.backHomeButton).toBeEnabled();
    await checkoutCompletePage.backHomeButton.click();

    // step: Then I should be redirected back to Products page
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productPage.productHeading).toBeVisible();
  });
});
