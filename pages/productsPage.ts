import { Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly productHeading: Locator;
  readonly allProducts: Locator;
  readonly productSortOptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productHeading = page.getByTestId("title");
    this.allProducts = page.getByTestId("inventory-item");
    this.productSortOptions = page.getByTestId("product-sort-container");
  }

  async addProductToCart(productName: string): Promise<void> {
    const product: Locator = this.allProducts.filter({ hasText: productName });

    const addToCartButton = product.getByRole("button", { name: "Add to cart" });
    await addToCartButton.click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const product: Locator = this.allProducts.filter({ hasText: productName });

    const removeButton = product.getByRole("button", { name: "Remove" });
    await removeButton.click();
  }
}
