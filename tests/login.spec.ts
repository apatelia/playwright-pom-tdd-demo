import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test('Login with valid credentials @login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin(page, 'standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    
    const productPage = new ProductsPage(page);
    await expect(productPage.productHeading).toBeVisible();
    
    productPage.header.doLogout();
    
    await expect(loginPage.loginButton).toBeVisible();
});

test('Login should fail with invalid credentials @login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin(page, 'locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();

    const errorText = await loginPage.errorMessage.textContent();
    expect(errorText).toEqual('Epic sadface: Sorry, this user has been locked out.')
});
