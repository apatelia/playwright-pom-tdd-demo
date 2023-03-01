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
    await expect(productPage.header.cartItemCount).toHaveCount(0);
});

test('Log out should work', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await productPage.header.doLogout();

    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
});

test('Footer: Twitter link should be present and open SauceLab`s Twitter page', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await expect(productPage.footer.twitterLink).toBeEnabled();

    const twitterPagePromise = page.context().waitForEvent('page');
    await productPage.footer.clickTwitterLink();

    const twitterPage = await twitterPagePromise;
    await twitterPage.waitForLoadState();

    await expect(twitterPage).toHaveURL('https://twitter.com/saucelabs');
});

test('Footer: Facebook link should be present and open SauceLab`s Facebook page', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await expect(productPage.footer.facebookLink).toBeEnabled();

    const facebookPagePromise = page.context().waitForEvent('page');
    await productPage.footer.clickFacebookLink();

    const facebookPage = await facebookPagePromise;
    await facebookPage.waitForLoadState();

    await expect(facebookPage).toHaveURL('https://www.facebook.com/saucelabs');
});

test('Footer: LinkedIn link should be present and open SauceLab`s LinkedIn page', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await expect(productPage.footer.linkedInLink).toBeEnabled();

    const linkedInPagePromise = page.context().waitForEvent('page');
    await productPage.footer.clickLinkedInLink();

    const linkedInPage = await linkedInPagePromise;

    await expect(linkedInPage).toHaveURL('https://www.linkedin.com/company/sauce-labs/');
});

test('Footer: Copyright text is visible and is correct', async ({ page }) => {
    const productPage = new ProductsPage(page);
    await expect(productPage.footer.copyrightText).toBeVisible();
    expect(await productPage.footer.getCopyrightTextContent()).toEqual('© 2023 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
});
