import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductsPage } from "../pages/products.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutStepOnePage } from "../pages/checkoutStepOne.page";
import { CheckoutStepTwoPage } from "../pages/checkoutStepTwo.page";
import { CheckoutCompletePage } from "../pages/checkoutComplete.page";
import { Header } from "../pages/fragments/header";
import { Footer } from "../pages/fragments/footer";

interface PageObjects {
  header: Header;
  footer: Footer;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
}

export const test = baseTest.extend<PageObjects>({
  header: async ({ page }, use) => {
    const header = new Header(page);
    await use(header);
  },
  footer: async ({ page }, use) => {
    const footer = new Footer(page);
    await use(footer);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  productsPage: async ({ page }, use) => {
    const productPage = new ProductsPage(page);
    await use(productPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutStepOnePage: async ({ page }, use) => {
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await use(checkoutStepOnePage);
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await use(checkoutStepTwoPage);
  },
  checkoutCompletePage: async ({ page }, use) => {
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await use(checkoutCompletePage);
  },
});

export { expect } from "@playwright/test";
