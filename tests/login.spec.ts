import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

const valid_users = [
    { username: "standard_user", password: "secret_sauce" },
    { username: "problem_user", password: "secret_sauce" },
    { username: "performance_glitch_user", password: "secret_sauce" },
];

const invalid_users = [
    { username: "invalid_username", password: "secret_sauce" },
    { username: "valid_username", password: "invalid_password" },
    { username: "invalid_username", password: "invalid_password" },
];

const locked_out_user = {
    username: "locked_out_user",
    password: "secret_sauce"
};

for (const user of valid_users) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`Login with valid credentials => '${username}' as user name and '${password}' as password @login @valid_creds`, async ({ page },) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.doLogin(username, password);

        await expect(page).toHaveURL(/.*inventory.html/);

        const productPage = new ProductsPage(page);
        await expect(productPage.productHeading).toBeVisible();

        productPage.header.doLogout();

        await expect(loginPage.loginButton).toBeVisible();
    });
}

for (const user of invalid_users) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`Login should fail with invalid credentials => '${username}' as user name and '${password}' as password @login @invalid_creds`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.doLogin(username, password);

        await expect(loginPage.errorMessage).toBeVisible();

        const errorText = await loginPage.errorMessage.textContent();
        expect(errorText).toEqual('Epic sadface: Username and password do not match any user in this service');
    });
}

test('Locked out user should not be able to login with valid credentials @login @locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin(locked_out_user.username, locked_out_user.password);

    await expect(loginPage.errorMessage).toBeVisible();

    const errorText = await loginPage.errorMessage.textContent();
    expect(errorText).toEqual('Epic sadface: Sorry, this user has been locked out.');
});
