import { test, expect } from "../fixtures/customTest";

test.describe("Checkout Feature Tests", { tag: [ "@checkout" ] }, () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await test.step("Given I am on login page", async () => {
      await loginPage.goto();
    });

    await test.step("When I try to login with \"standard_user\" as username and \"secret_sauce\" as password", async () => {
      await loginPage.doLogin("standard_user", "secret_sauce");
    });

    await test.step("Then I should be on Products page", async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.productHeading).toBeVisible();
    });
  });

  test("Place an order", { tag: [ "@order" ] },
    async ({ page, header, productsPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage }) => {
      const productName = "Sauce Labs Backpack";
      const productPrice = "$29.99";
      const productQuantity = 1;

      await test.step("When I add \"Sauce Labs Backpack\" to the cart", async () => {
        await productsPage.addProductToCart(productName);
      });

      await test.step("And I go to the cart page", async () => {
        await header.goToCart();
      });

      await test.step("Then Product price on the cart page, should match with price of the product added", async () => {
        expect(await cartPage.getProductPrice(productName)).toEqual(productPrice);
      });

      await test.step("Then Product quantity on the cart page, should match with quantity of the product added", async () => {
        expect(await cartPage.getProductQuantity(productName)).toEqual(productQuantity);
      });

      await test.step("When I start checkout", async () => {
        await cartPage.doCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
      });

      await test.step("And I fill customer information and continue with checkout", async () => {
        await checkoutStepOnePage.fillCustomerInformation();
        await checkoutStepOnePage.doCheckout();
      });

      await test.step("And I verify product details on the checkout summary page and complete the checkout", async () => {
        expect(await checkoutStepTwoPage.getProductPrice(productName)).toEqual(productPrice);
        expect(await checkoutStepTwoPage.getProductQuantity(productName)).toEqual(productQuantity);
        await checkoutStepTwoPage.finishCheckout();
      });

      await test.step("Then I am greeted with a 'Thank You' message upon completing the checkout", async () => {
        await expect(checkoutCompletePage.thankYouHeading).toBeVisible();
      });
    },
  );

  test("Clicking `Back Home` button takes back to `Products` page",
    async ({ page, header, productsPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage }) => {
      const productName = "Sauce Labs Fleece Jacket";
      await test.step("When I add \"Sauce Labs Fleece Jacket\" to the cart", async () => {
        await productsPage.addProductToCart(productName);
      });

      await test.step("Then I go to the cart page", async () => {
        await header.goToCart();
      });

      await test.step("When I start checkout", async () => {
        await cartPage.doCheckout();
      });

      await test.step("And I fill customer information and continue with checkout", async () => {
        await checkoutStepOnePage.fillCustomerInformation();
        await checkoutStepOnePage.doCheckout();
      });

      await test.step("And I complete checkout", async () => {
        await checkoutStepTwoPage.finishCheckout();
      });

      await test.step("When I click on 'Back To Home' button", async () => {
        await expect(checkoutCompletePage.backHomeButton).toBeEnabled();
        await checkoutCompletePage.backHomeButton.click();
      });

      await test.step("Then I should be redirected back to Products page", async () => {
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(productsPage.productHeading).toBeVisible();
      });
    },
  );
});
