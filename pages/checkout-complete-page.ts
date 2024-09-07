import { Locator, Page } from '@playwright/test';
import { Header } from './header';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly header: Header;
  readonly checkoutHeading: Locator;
  readonly thankYouHeading: Locator;
  readonly backHomeButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.checkoutHeading = page.getByText('Checkout: Complete!');
    this.thankYouHeading = page.getByRole('heading', { name: 'THANK YOU FOR YOUR ORDER' });
    this.backHomeButton = page.getByRole('button', { name: 'BACK HOME' });
  }

  async goBackToProductsPage (): Promise<void> {
    await this.backHomeButton.click();
  }
}
