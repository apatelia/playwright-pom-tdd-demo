import { test, expect } from "../fixtures/customTest";
import { products } from "../test-data/products.data";

test.describe("Products Listing Page Tests", {
  tag: [ "@products_page" ]
}, () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await test.step("Given I am on login page", async () => {
      await loginPage.goto();
    });

    await test.step("When I try to login as a valid user", async () => {
      await loginPage.loginAsStandardUser();
    });

    await test.step("Then I should be on Products page", async () => {
      await expect.soft(page).toHaveURL(/.*inventory.html/);
      await expect.soft(productsPage.productHeading).toBeVisible();
    });
  });

  test("add a product to the cart", {
    tag: [ "@add_to_cart" ]
  }, async ({ header, productsPage }) => {
    const productName = products.backpack.name;

    await test.step(`When I add ${productName} to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step("Then the cart item badge must show correct count of 1", async () => {
      const cartItemCount = await header.getCartItemCount();
      expect.soft(cartItemCount).toStrictEqual(1);
    });
  });

  test("remove a product from the cart", {
    tag: [ "@remove_from_cart" ]
  }, async ({ header, productsPage }) => {
    const productName = products.bikeLight.name;

    await test.step(`When I add ${productName} to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step("Then the cart item badge must show correct count of 1", async () => {
      const cartItemCount = await header.getCartItemCount();
      expect.soft(cartItemCount).toStrictEqual(1);
    });

    await test.step(`Then I should be able to remove ${productName} from the cart, using the Remove button`, async () => {
      await productsPage.removeProductFromCart(productName);
    });

    await test.step("And the cart item badge must not be displayed", async () => {
      await expect.soft(header.cartItemCount).toHaveCount(0);
    });
  });

  test("log out should work", {
    tag: [ "@logout" ]
  }, async ({ header, loginPage }) => {
    await test.step("When I click Log out from hamburger menu", async () => {
      await header.logout();
    });

    await test.step("Then I must be logged out", async () => {
      await expect.soft(loginPage.loginButton).toBeVisible();
    });
  });

  test("footer: Twitter/X link should be present and open SauceLab`s Twitter page", {
    tag: [ "@footer", "@social_media" ]
  }, async ({ page, footer }) => {
    await test.step("Given that \"Twitter/X\" link in footer is visible", async () => {
      await expect.soft(footer.twitterLink).toBeEnabled();
    });

    const twitterPagePromise = page.context().waitForEvent("page");

    await test.step("When I click \"Twitter/X\" link from footer", async () => {
      await footer.clickTwitterLink();
    });

    await test.step("Then it should open correct URL in a new tab", async () => {
      const twitterPage = await twitterPagePromise;

      await expect.soft(twitterPage).toHaveURL(/^https:\/\/x.com\/saucelabs/);
    });
  });

  test("footer: Facebook link should be present and open SauceLab`s Facebook page", {
    tag: [ "@footer", "@social_media" ]
  }, async ({ page, footer }) => {
    await test.step("Given that \"Facebook\" link in footer is visible", async () => {
      await expect.soft(footer.facebookLink).toBeEnabled();
    });

    const facebookPagePromise = page.context().waitForEvent("page");

    await test.step("When I click \"Facebook\" link from footer", async () => {
      await footer.clickFacebookLink();
    });

    await test.step("Then it should open correct URL in a new tab", async () => {
      const facebookPage = await facebookPagePromise;

      await expect.soft(facebookPage).toHaveURL(/^https:\/\/www.facebook.com\/saucelabs/);
    });
  });

  test("footer: LinkedIn link should be present and open SauceLab`s LinkedIn page", {
    tag: [ "@footer", "@social_media" ]
  }, async ({ page, footer }) => {
    await test.step("Given that \"LinkedIn\" link in footer is visible", async () => {
      await expect.soft(footer.linkedInLink).toBeEnabled();
    });

    const linkedInPagePromise = page.context().waitForEvent("page");

    await test.step("When I click \"LinkedIn\" link from footer", async () => {
      await footer.clickLinkedInLink();
    });

    await test.step("Then it should open correct URL in a new tab", async () => {
      const linkedInPage = await linkedInPagePromise;

      await expect.soft(linkedInPage).toHaveURL(/^https:\/\/www.linkedin.com\/company\/sauce-labs/);
    });
  });

  test("footer: Copyright text is visible and is correct", {
    tag: [ "@footer", "@copyright" ]
  }, async ({ footer }) => {
    await test.step("Then copyright text in footer should be visible", async () => {
      await expect.soft(footer.copyrightText).toBeVisible();
    });

    await test.step("And the copyright text contents should be correct", async () => {
      const currentYear = new Date().getFullYear();
      expect.soft(await footer.getCopyrightTextContent()).toStrictEqual(`© ${currentYear} Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy`);
    });
  });
});
