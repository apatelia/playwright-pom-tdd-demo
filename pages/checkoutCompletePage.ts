import { Locator, Page } from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;
  readonly thankYouHeading: Locator;
  readonly backHomeButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.thankYouHeading = page.getByRole("heading", { name: "THANK YOU FOR YOUR ORDER" });
    this.backHomeButton = page.getByRole("button", { name: "BACK HOME" });
  }

  async goBackToProductsPage (): Promise<void> {
    await this.backHomeButton.click();
  }
}
