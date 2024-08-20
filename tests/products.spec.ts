import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.beforeEach(async ({ page }) => {
    await test.step(`Login and go to Products page`, async () => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.doLogin('standard_user', 'secret_sauce');
    }, { box: true });
});


test('Add a product to the cart @products', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    const productPage = new ProductsPage(page);

    await test.step(`User adds a product to an empty cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`Cart count must be increased to 1`, async () => {
        const cartItemCount = await productPage.header.getCartItemCount();
        expect(cartItemCount).toEqual(1);
    }, { box: true });
});

test('Add and then remove a product to/from the cart @products', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);

    await test.step(`User adds a product to an empty cart`, async () => {
        await productPage.addProductToCart(productName);
    }, { box: true });

    await test.step(`Cart count must be increased to 1`, async () => {
        const cartItemCount = await productPage.header.getCartItemCount();
        expect(cartItemCount).toEqual(1);
    }, { box: true });

    await test.step(`User removes previously added product from the cart`, async () => {
        await productPage.removeProductFromCart(productName);
    }, { box: true });

    await test.step(`Cart count must be decreased to 0`, async () => {
        await expect(productPage.header.cartItemCount).toHaveCount(0);
    }, { box: true });
});

test('Log out should work', async ({ page }) => {
    const productPage = new ProductsPage(page);

    await test.step(`User logs out using header menu`, async () => {
        await productPage.header.doLogout();
    }, { box: true });

    await test.step(`User must be logged out and should be on Login page`, async () => {
        const loginPage = new LoginPage(page);
        await expect(loginPage.loginButton).toBeVisible();
    }, { box: true });
});

test('Footer: Twitter/X link should be present and open SauceLab`s Twitter page', async ({ page }) => {
    const productPage = new ProductsPage(page);

    await test.step(`Twitter/X link should be present in footer`, async () => {
        await expect(productPage.footer.twitterLink).toBeEnabled();
    }, { box: true });

    await test.step(`Twitter/X link should open SauceLab's Twitter/X page, when clicked`, async () => {
        const twitterPagePromise = page.context().waitForEvent('page');
        await productPage.footer.clickTwitterLink();

        const twitterPage = await twitterPagePromise;
        await twitterPage.waitForLoadState();

        await expect(twitterPage).toHaveURL('https://x.com/saucelabs');
    }, { box: true });
});

test('Footer: Facebook link should be present and open SauceLab`s Facebook page', async ({ page }) => {
    const productPage = new ProductsPage(page);

    await test.step(`Facebook link should be present in footer`, async () => {
        await expect(productPage.footer.facebookLink).toBeEnabled();
    }, { box: true });

    await test.step(`Facebook link should open SauceLab's Facebook page, when clicked`, async () => {
        const facebookPagePromise = page.context().waitForEvent('page');
        await productPage.footer.clickFacebookLink();

        const facebookPage = await facebookPagePromise;
        await facebookPage.waitForLoadState();

        await expect(facebookPage).toHaveURL('https://www.facebook.com/saucelabs');
    }, { box: true });
});

test('Footer: LinkedIn link should be present and open SauceLab`s LinkedIn page', async ({ page }) => {
    const productPage = new ProductsPage(page);

    await test.step(`LinkedIn link should be present in footer`, async () => {
        await expect(productPage.footer.linkedInLink).toBeEnabled();
    }, { box: true });

    await test.step(`LinkedIn link should open SauceLab's LinkedIn page, when clicked`, async () => {
        const linkedInPagePromise = page.context().waitForEvent('page');
        await productPage.footer.clickLinkedInLink();

        const linkedInPage = await linkedInPagePromise;

        await expect(linkedInPage).toHaveURL('https://www.linkedin.com/company/sauce-labs/');
    }, { box: true });
});

test('Footer: Copyright text is visible and is correct', async ({ page }) => {
    const productPage = new ProductsPage(page);

    await test.step(`Copyright text should be present in footer`, async () => {
        await expect(productPage.footer.copyrightText).toBeVisible();
    }, { box: true });

    await test.step(`Copyright text should be correct`, async () => {
        expect(await productPage.footer.getCopyrightTextContent()).toEqual('© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
    }, { box: true });
});
