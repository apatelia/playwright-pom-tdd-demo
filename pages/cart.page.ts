import { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartHeading: Locator;
  readonly allProductsInCart: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartHeading = page.getByTestId("title");
    this.allProductsInCart = page.getByTestId("inventory-item");
    this.continueShoppingButton = page.getByRole("button", { name: "Go back CONTINUE SHOPPING" });
    this.checkoutButton = page.getByRole("button", { name: "CHECKOUT" });
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const product: Locator = this.allProductsInCart.filter({ hasText: productName });

    const removeButton = product.getByRole("button", { name: "Remove" });
    await removeButton.click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product: Locator = this.allProductsInCart.filter({ hasText: productName });

    const price = `${await product.getByTestId("inventory-item-price").textContent()}`;

    return price === "" ? "$0" : price;
  }

  async getProductQuantity(productName: string): Promise<number> {
    const product: Locator = this.allProductsInCart.filter({ hasText: productName });

    const quantity = `${await product.getByTestId("item-quantity").textContent()}`;

    return quantity === "" ? 0 : +quantity;
  }
}
