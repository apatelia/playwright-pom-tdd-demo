import { test, expect } from "../fixtures/customTest";
import { products } from "../test-data/products.data";

test.describe("Cart Feature Tests", {
  tag: [ "@cart" ]
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

  test("verify product details from the cart",
    async ({ header, productsPage, cartPage }) => {
      const productName = products.backpack.name;
      const productPrice = products.backpack.price;
      const productQuantity = 1;

      await test.step(`When I add ${productName} to the cart`, async () => {
        await productsPage.addProductToCart(productName);
      });

      await test.step("And I go to the cart page", async () => {
        await header.goToCart();
      });

      await test.step(`Then price of the ${productName} in cart must match ${productPrice}"`, async () => {
        expect.soft(await cartPage.getProductPrice(productName)).toStrictEqual(productPrice);
      });

      await test.step(`And quantity of the ${productName} in cart must match 1`, async () => {
        expect.soft(await cartPage.getProductQuantity(productName)).toStrictEqual(productQuantity);
      });
    });

  test("remove a product from the cart", {
    tag: [ "@remove_from_cart" ]
  }, async ({ header, productsPage, cartPage }) => {
    const productName = products.bikeLight.name;

    await test.step(`When I add ${productName} to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step("And I go to the cart page", async () => {
      await header.goToCart();
    });

    await test.step(`Then quantity of the ${productName} in cart must match 1`, async () => {
      const cartItemCount = await header.getCartItemCount();
      expect.soft(cartItemCount).toStrictEqual(1);
    });

    await test.step(`When I remove ${productName} from the cart`, async () => {
      await cartPage.removeProductFromCart(productName);
    });

    await test.step("Then the cart item badge must not be displayed", async () => {
      await expect.soft(header.cartItemCount).toBeHidden();
      const cartItemCount = await header.getCartItemCount();
      expect.soft(cartItemCount).toStrictEqual(0);
    });
  });

  test("continue Shopping button takes back to Products page", {
    tag: [ "@continue_shopping" ]
  }, async ({ page, header, productsPage, cartPage }) => {
    await test.step("When I go to the cart page", async () => {
      await header.goToCart();
    });

    await test.step("And I click on the Continue Shopping button", async () => {
      await cartPage.continueShopping();
    });

    await test.step("Then I should be on Products page", async () => {
      await expect.soft(page).toHaveURL(/.*inventory.html/);
      await expect.soft(productsPage.productHeading).toBeVisible();
    });
  });

  test("clicking `Checkout` button starts checkout", {
    tag: [ "@checkout" ]
  }, async ({ page, header, productsPage, cartPage }) => {
    const productName = products.fleeceJacket.name;

    await test.step(`When I add ${productName} to the cart`, async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step("And I go to the cart page", async () => {
      await header.goToCart();
    });

    await test.step("When I click on the Checkout button", async () => {
      await cartPage.checkout();
    });

    await test.step("Then I should be on \"Your Information\" page", async () => {
      await expect.soft(page).toHaveURL(/.*checkout-step-one.html/);
    });
  });
});
