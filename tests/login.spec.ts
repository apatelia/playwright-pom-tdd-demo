import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

test.describe(`Login feature tests`, { tag: [ `@login` ] }, () => {
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
    test(`Login with valid credentials => '${username}' as user name and '${password}' as password`, { tag: [ `@valid_creds` ] }, async ({ page },) => {
      const loginPage = new LoginPage(page);

      // step: Given I am on login page
      await loginPage.goto();

      // step: When I try to login with a valid username and a valid password
      await loginPage.doLogin(username, password);

      // step: Then I should be on Products page
      await expect(page).toHaveURL(/.*inventory.html/);

      // step: And I am able to log out from the products page
      const productPage = new ProductsPage(page);
      await expect(productPage.productHeading).toBeVisible();
      await productPage.header.doLogout();
      await expect(loginPage.loginButton).toBeVisible();
    });
  }

  for (const user of invalidUsers) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`Login should fail with invalid credentials => '${username}' as user name and '${password}' as password @login @invalid_creds`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // step: Given I am on login page
      await loginPage.goto();

      // step: When I try to login with a valid username and a valid password
      await loginPage.doLogin(username, password);

      // step: Then I should see invalid credentials error message
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.errorMessage.textContent();
      expect(errorText).toEqual('Epic sadface: Username and password do not match any user in this service');
    });
  }

  test('Locked out user should not be able to login with valid credentials @login @locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // step: Given I am on login page
    await loginPage.goto();

    // step: When I try to login with a valid username and a valid password
    await loginPage.doLogin(lockedOutUser.username, lockedOutUser.password);

    // step: Then I should see a locked out error message
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.errorMessage.textContent();
    expect(errorText).toEqual('Epic sadface: Sorry, this user has been locked out.');
  });
});
