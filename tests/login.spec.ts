import { test, expect } from "../fixtures/customTest";
import { validUsers, invalidUsers, lockedOutUser } from "../test-data/user.data";

test.describe("Login Feature Test", {
  tag: [ "@login" ]
}, () => {

  for (const user of validUsers) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`login with valid credentials => '${username}' as username and '${password}' as password`, {
      tag: [ "@valid_credentials" ]
    }, async ({ page, header, loginPage, productsPage }) => {
      await test.step("Given I am on login page", async () => {
        await loginPage.goto();
      });

      await test.step("When I try to login with a valid username and a valid password", async () => {
        await loginPage.login(username, password);
      });

      await test.step("Then I should be on Products page", async () => {
        await expect.soft(page).toHaveURL(/.*inventory.html/);
        await expect.soft(productsPage.productHeading).toBeVisible();
      });

      await test.step("And I am able to log out from the products page", async () => {
        await header.logout();
        await expect.soft(loginPage.loginButton).toBeVisible();
      });
    });
  }

  for (const user of invalidUsers) {
    const username = user.username;
    const password = user.password;

    // Test name/title should be unique for each parameter.
    test(`login should fail with invalid credentials => '${username}' as username and '${password}' as password`, {
      tag: [ "@invalid_credentials" ]
    }, async ({ loginPage }) => {
      await test.step("Given I am on login page", async () => {
        await loginPage.goto();
      });

      await test.step("When I try to login with an invalid username and password combination", async () => {
        await loginPage.login(username, password);
      });

      await test.step("Then I should see invalid credentials error message", async () => {
        await expect.soft(loginPage.errorMessage).toBeVisible();
        await expect.soft(loginPage.errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
      });
    });
  }

  test("locked out user should not be able to login with valid credentials", {
    tag: [ "@locked_out_user" ]
  }, async ({ loginPage }) => {
    await test.step("Given I am on login page", async () => {
      await loginPage.goto();
    });

    await test.step("When I try to login with a disabled username and a valid password", async () => {
      await loginPage.login(lockedOutUser.username, lockedOutUser.password);
    });

    await test.step("Then I should see an appropriate error message", async () => {
      await expect.soft(loginPage.errorMessage).toBeVisible();
      await expect.soft(loginPage.errorMessage).toHaveText("Epic sadface: Sorry, this user has been locked out.");
    });
  });
});
