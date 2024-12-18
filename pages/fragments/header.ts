import { Locator, Page } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly hamburgerMenuButton: Locator;
  readonly logoutMenuEntry: Locator;
  readonly hamburgerMenuCloseButton: Locator;
  readonly cartLink: Locator;
  readonly cartItemCount: Locator;

  constructor (page: Page) {
    this.page = page;
    this.hamburgerMenuButton = page.getByRole("button", { name: "Open Menu" });
    this.logoutMenuEntry = page.getByRole("link", { name: "Logout" });
    this.hamburgerMenuCloseButton = page.getByRole("button", { name: "Close Menu" });
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartItemCount = page.getByTestId("shopping-cart-badge");
  }

  async logout (): Promise<void> {
    await this.hamburgerMenuButton.click();
    await this.logoutMenuEntry.click();
  }

  async closeMenu (): Promise<void> {
    await this.hamburgerMenuCloseButton.click();
  }

  async goToCart (): Promise<void> {
    await this.cartLink.click();
  }

  async getCartItemCount (): Promise<number> {
    let itemCount = 0;

    if (await this.cartItemCount.isVisible()) {
      const count = `${await this.cartItemCount.textContent()}`;
      itemCount = count === "" ? 0 : +count;
    }

    return itemCount;
  }
}
