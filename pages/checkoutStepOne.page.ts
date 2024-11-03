import { Locator, Page } from "@playwright/test";

export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByPlaceholder("First Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.zipCode = page.getByPlaceholder("Zip/Postal Code");
    this.cancelButton = page.getByRole("button", { name: "Go back CANCEL" });
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout-step-one.html");
  }

  async doCancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async doCheckout(): Promise<void> {
    await this.continueButton.click();
  }

  async fillCustomerInformation(): Promise<void> {
    await this.firstName.fill("FirstName");
    await this.lastName.fill("LastName");
    await this.zipCode.fill("000000");
  }
}
