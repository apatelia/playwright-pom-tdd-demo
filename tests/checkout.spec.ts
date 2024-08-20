import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { CheckoutCompletePage } from '../pages/checkout-complete-page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one-page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    await test.step(`Login and go to Products page`, async () => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.doLogin('standard_user', 'secret_sauce');
    }, { box: true });
});


test('Place an order @checkout', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productPrice = '$29.99';
    const productQuantity = 1;

    const productPage = new ProductsPage(page);

    await test.step(`User adds a product to the cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    const cartPage = new CartPage(page);

    await test.step(`Product details on the cart page, should match with details of the product added`, async () => {
        expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);
        expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);
    }, { box: true });

    await test.step(`User starts checkout`, async () => {
        await cartPage.doCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    }, { box: true });

    await test.step(`User fills customer information and continues with checkout`, async () => {
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.fillCustomerInformation();
        await checkoutStepOnePage.doCheckout();
    }, { box: true });

    await test.step(`User continues checkout after verifying product details on the checkout summary page`, async () => {
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        expect(await checkoutStepTwoPage.getProductPrice(productName)).toEqual(productPrice);
        expect(await checkoutStepTwoPage.getProductQuantity(productName)).toEqual(productQuantity);
        await checkoutStepTwoPage.finishCheckout();
    }, { box: true });

    await test.step(`User is greeted with a 'Thank You' message upon completing the checkout`, async () => {
        const checkoutCompletePage = new CheckoutCompletePage(page);
        await expect(checkoutCompletePage.thankYouHeading).toBeVisible();
    }, { box: true });
});


test('Clicking `Back Home` button takes back to `Products` page @checkout', async ({ page }) => {
    const productName = 'Sauce Labs Fleece Jacket';

    const productPage = new ProductsPage(page);

    await test.step(`User adds a product to the cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`User visits the cart page`, async () => {
        await productPage.header.goToCart();
    }, { box: true });

    await test.step(`User starts checkout`, async () => {
        const cartPage = new CartPage(page);
        await cartPage.doCheckout();
    }, { box: true });

    await test.step(`User fills customer information and continues with checkout`, async () => {
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.fillCustomerInformation();
        await checkoutStepOnePage.doCheckout();
    }, { box: true });

    await test.step(`User continues checkout from the checkout summary page`, async () => {
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        await checkoutStepTwoPage.finishCheckout();
    }, { box: true });

    await test.step(`User clicks on 'Back To Home' button after finishing checkout`, async () => {
        const checkoutCompletePage = new CheckoutCompletePage(page);
        await expect(checkoutCompletePage.backHomeButton).toBeEnabled();
        await checkoutCompletePage.backHomeButton.click();
    }, { box: true });

    await test.step(`User should be redirected back to Products page`, async () => {
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(productPage.productHeading).toBeVisible();
    }, { box: true });
});
