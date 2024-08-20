import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

const validUsers = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' },
    { username: 'performance_glitch_user', password: 'secret_sauce' },
];

const invalidUsers = [
    { username: 'invalid_username', password: 'secret_sauce' },
    { username: 'valid_username', password: 'invalid_password' },
    { username: 'invalid_username', password: 'invalid_password' },
];

const lockedOutUser = {
    username: 'locked_out_user',
    password: 'secret_sauce'
};

for (const user of validUsers) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`Login with valid credentials => '${username}' as user name and '${password}' as password @login @valid_creds`, async ({ page },) => {
        const loginPage = new LoginPage(page);

        await test.step(`User visits the Login Page`, async () => {
            await loginPage.goto();
        }, { box: true });

        await test.step(`User tries to login using a valid username and password combination`, async () => {
            await loginPage.doLogin(username, password);
        }, { box: true });

        await test.step(`User should be logged in successfully`, async () => {
            await expect(page).toHaveURL(/.*inventory.html/);
        }, { box: true });

        await test.step(`User should be able to log out from products page`, async () => {
            const productPage = new ProductsPage(page);
            await expect(productPage.productHeading).toBeVisible();
            await productPage.header.doLogout();
            await expect(loginPage.loginButton).toBeVisible();
        }, { box: true });
    });
}

for (const user of invalidUsers) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`Login should fail with invalid credentials => '${username}' as user name and '${password}' as password @login @invalid_creds`, async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step(`User visits the Login Page`, async () => {
            await loginPage.goto();
        }, { box: true });

        await test.step(`User tries to login using an invalid username and password combination`, async () => {
            await loginPage.doLogin(username, password);
        }, { box: true });

        await test.step(`User must not be logged in and should see the error message`, async () => {
            await expect(loginPage.errorMessage).toBeVisible();
            const errorText = await loginPage.errorMessage.textContent();
            expect(errorText).toEqual('Epic sadface: Username and password do not match any user in this service');
        }, { box: true });
    });
}

test('Locked out user should not be able to login with valid credentials @login @locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step(`User visits the Login Page`, async () => {
        await loginPage.goto();
    }, { box: true });

    await test.step(`User tries to login using a valid but disabled username and password combination`, async () => {
        await loginPage.doLogin(lockedOutUser.username, lockedOutUser.password);
    }, { box: true });

    await test.step(`User must not be logged in and should see an appropriate error message`, async () => {
        await expect(loginPage.errorMessage).toBeVisible();
        const errorText = await loginPage.errorMessage.textContent();
        expect(errorText).toEqual('Epic sadface: Sorry, this user has been locked out.');
    }, { box: true });
});
