import { Locator, Page } from '@playwright/test';
import { Header } from './header';

export class CheckoutStepTwoPage {
    readonly page: Page;
    readonly header: Header;
    readonly checkoutHeading: Locator;
    readonly productsToBeCheckedOut: Locator;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.checkoutHeading = page.getByText('Checkout: Overview');
        this.productsToBeCheckedOut = page.locator('div.cart_item');
        this.cancelButton = page.getByRole('button', { name: 'Go back CANCEL' });
        this.finishButton = page.getByRole('button', { name: 'FINISH' });
    }

    async goto() : Promise<void> {
        await this.page.goto('/checkout-step-one.html');
    }

    async doCancelCheckout() : Promise<void> {
        await this.cancelButton.click();
    }

    async finishCheckout() : Promise<void> {
        await this.finishButton.click();
    }

    async getProductPrice(productName: string) : Promise<string> {
        const product: Locator = this.productsToBeCheckedOut.filter({ hasText: productName });
        
        const price = await product.locator('div.inventory_item_price').textContent();

        return price!;
    }

    async getProductQuantity(productName: string) : Promise<number> {
        const product: Locator = this.productsToBeCheckedOut.filter({ hasText: productName });

        const quantity = await product.locator('div.cart_quantity').textContent();

        return +quantity!;
    }
}
