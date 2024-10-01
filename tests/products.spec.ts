import { test, expect } from "../fixtures/customTest";

test.describe("Products Listing Page Tests", { tag: [`@products_page`] }, () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await test.step(`Given I am on login page`, async () => {
      await loginPage.goto();
    });

    await test.step(`When I try to login with "standard_user" as username and "secret_sauce" as password`, async () => {
      await loginPage.doLogin("standard_user", "secret_sauce");
    });

    await test.step(`Then I should be on Products page`, async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.productHeading).toBeVisible();
    });
  });

  test("Add a product to the cart", { tag: [`@add_to_cart`] }, async ({ header, productsPage }) => {
    const productName = "Sauce Labs Backpack";

    await test.step(`When I add "Sauce Labs Backpack" to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step(`Then the cart item badge must show correct count of 1`, async () => {
      const cartItemCount = await header.getCartItemCount();
      expect(cartItemCount).toEqual(1);
    });
  });

  test("Remove a product from the cart", { tag: [`@remove_from_cart`] }, async ({ header, productsPage }) => {
    const productName = "Sauce Labs Bike Light";

    await test.step(`When I add "Sauce Labs Bike Light" to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step(`Then the cart item badge must show correct count of 1`, async () => {
      const cartItemCount = await header.getCartItemCount();
      expect(cartItemCount).toEqual(1);
    });

    await test.step(`Then I should be able to remove "Sauce Labs Bike Light" from the cart, using the Remove button`, async () => {
      await productsPage.removeProductFromCart(productName);
    });

    await test.step(`And the cart item badge must not be displayed`, async () => {
      await expect(header.cartItemCount).toHaveCount(0);
    });
  });

  test("Log out should work", { tag: [`@logout`] }, async ({ header, loginPage }) => {
    await test.step(`When I click Log out from hamburger menu`, async () => {
      await header.doLogout();
    });

    await test.step(`Then I must be logged out`, async () => {
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test(
    "Footer: Twitter/X link should be present and open SauceLab`s Twitter page",
    { tag: [`@footer`, `@social_media`] },
    async ({ page, footer }) => {
      await test.step(`Given that "Twitter/X" link in footer is visible`, async () => {
        await expect(footer.twitterLink).toBeEnabled();
      });

      const twitterPagePromise = page.context().waitForEvent("page");

      await test.step(`When I click "Twitter/X" link from footer`, async () => {
        await footer.clickTwitterLink();
      });

      await test.step(`Then it should open correct URL in a new tab`, async () => {
        const twitterPage = await twitterPagePromise;

        await expect(twitterPage).toHaveURL("https://x.com/saucelabs");
      });
    }
  );

  test(
    "Footer: Facebook link should be present and open SauceLab`s Facebook page",
    { tag: [`@footer`, `@social_media`] },
    async ({ page, footer }) => {
      await test.step(`Given that "Facebook" link in footer is visible`, async () => {
        await expect(footer.facebookLink).toBeEnabled();
      });

      const facebookPagePromise = page.context().waitForEvent("page");

      await test.step(`When I click "Facebook" link from footer`, async () => {
        await footer.clickFacebookLink();
      });

      await test.step(`Then it should open correct URL in a new tab`, async () => {
        const facebookPage = await facebookPagePromise;

        await expect(facebookPage).toHaveURL("https://www.facebook.com/saucelabs");
      });
    }
  );

  test(
    "Footer: LinkedIn link should be present and open SauceLab`s LinkedIn page",
    { tag: [`@footer`, `@social_media`] },
    async ({ page, footer }) => {
      await test.step(`Given that "LinkedIn" link in footer is visible`, async () => {
        await expect(footer.linkedInLink).toBeEnabled();
      });

      const linkedInPagePromise = page.context().waitForEvent("page");

      await test.step(`When I click "LinkedIn" link from footer`, async () => {
        await footer.clickLinkedInLink();
      });

      await test.step(`Then it should open correct URL in a new tab`, async () => {
        const linkedInPage = await linkedInPagePromise;

        await expect(linkedInPage).toHaveURL("https://www.linkedin.com/company/sauce-labs/");
      });
    }
  );

  test("Footer: Copyright text is visible and is correct", { tag: [`@footer`, `@copyright`] }, async ({ footer }) => {
    await test.step(`Then copyright text in footer should be visible`, async () => {
      await expect(footer.copyrightText).toBeVisible();
    });

    await test.step(`And the copyright text contents should be correct`, async () => {
      expect(await footer.getCopyrightTextContent()).toEqual("© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy");
    });
  });
});
