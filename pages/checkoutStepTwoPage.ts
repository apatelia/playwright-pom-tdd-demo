import { Locator, Page } from "@playwright/test";

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly productsToBeCheckedOut: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsToBeCheckedOut = page.locator("div.cart_item");
    this.cancelButton = page.getByRole("button", { name: "Go back CANCEL" });
    this.finishButton = page.getByRole("button", { name: "FINISH" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout-step-one.html");
  }

  async doCancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product: Locator = this.productsToBeCheckedOut.filter({
      hasText: productName
    });

    const price = `${await product.locator("div.inventory_item_price").textContent()}`;

    return price === "" ? "$0" : price;
  }

  async getProductQuantity(productName: string): Promise<number> {
    const product: Locator = this.productsToBeCheckedOut.filter({
      hasText: productName
    });

    const quantity = `${await product.locator("div.cart_quantity").textContent()}`;

    return quantity === "" ? 0 : +quantity;
  }
}
