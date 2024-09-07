import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.describe('Product Listing Page Tests', { tag: [ `@products_page` ] }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    // step: Given I am on login page
    await loginPage.goto();

    // step: When I try to login with "standard_user" as username and "secret_sauce" as password
    await loginPage.doLogin('standard_user', 'secret_sauce');

    // step: Then I should be on Products page
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Add a product to the cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    const productPage = new ProductsPage(page);

    // step: When I add "Sauce Labs Backpack" to the cart
    await productPage.addProductToCart(productName);

    // step: Then the cart item badge must show correct count of 1
    const cartItemCount = await productPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);
  });

  test('Add and then remove a product to/from the cart', async ({ page }) => {
    const productName = 'Sauce Labs Bike Light';

    const productPage = new ProductsPage(page);

    // step: When I add "Sauce Labs Backpack" to the cart
    await productPage.addProductToCart(productName);

    // step: Then the cart item badge must show correct count of 1
    const cartItemCount = await productPage.header.getCartItemCount();
    expect(cartItemCount).toEqual(1);

    // step: Then I should be able to remove "Sauce Labs Bike Light" from the cart, using the Remove button
    await productPage.removeProductFromCart(productName);

    // step: And the cart item badge must not be displayed
    await expect(productPage.header.cartItemCount).toHaveCount(0);
  });

  test('Log out should work', { tag: [ `@logout` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);

    // step: When I click Log out from hamburger menu
    await productPage.header.doLogout();

    // step: Then I must be logged out
    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Footer: Twitter/X link should be present and open SauceLab`s Twitter page', { tag: [ `@footer`, `@social_media` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);
    const twitterPagePromise = page.context().waitForEvent('page');

    // step: Given that "Twitter/X" link in footer is visible
    await expect(productPage.footer.twitterLink).toBeEnabled();

    // step: When I click "Twitter/X" link from footer
    await productPage.footer.clickTwitterLink();

    // step: Then it should open correct URL in a new tab
    const twitterPage = await twitterPagePromise;
    await twitterPage.waitForLoadState();
    await expect(twitterPage).toHaveURL('https://x.com/saucelabs');
  });

  test('Footer: Facebook link should be present and open SauceLab`s Facebook page', { tag: [ `@footer`, `@social_media` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);
    const facebookPagePromise = page.context().waitForEvent('page');

    // step: Given that "Facebook" link in footer is visible
    await expect(productPage.footer.facebookLink).toBeEnabled();

    // step: When I click "Facebook" link from footer
    await productPage.footer.clickFacebookLink();

    // step: Then it should open correct URL in a new tab
    const facebookPage = await facebookPagePromise;
    await facebookPage.waitForLoadState();
    await expect(facebookPage).toHaveURL('https://www.facebook.com/saucelabs');
  });

  test('Footer: LinkedIn link should be present and open SauceLab`s LinkedIn page', { tag: [ `@footer`, `@social_media` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);
    const linkedInPagePromise = page.context().waitForEvent('page');

    // step: Given that "LinkedIn" link in footer is visible
    await expect(productPage.footer.linkedInLink).toBeEnabled();

    // step: When I click "LinkedIn" link from footer
    await productPage.footer.clickLinkedInLink();

    // step: Then it should open correct URL in a new tab
    const linkedInPage = await linkedInPagePromise;
    await expect(linkedInPage).toHaveURL('https://www.linkedin.com/company/sauce-labs/');
  });

  test('Footer: Copyright text is visible and is correct', { tag: [ `@footer` ] }, async ({ page }) => {
    const productPage = new ProductsPage(page);

    // step: Then copyright text in footer should be visible
    await expect(productPage.footer.copyrightText).toBeVisible();

    // step: And the copyright text contents should be correct
    expect(await productPage.footer.getCopyrightTextContent()).toEqual('© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
  });
});
