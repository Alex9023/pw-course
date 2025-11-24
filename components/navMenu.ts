import { expect, type Locator, type Page } from "@playwright/test";

export default class Navigation {
  readonly page: Page;
  readonly newArticleBtn: Locator;
  readonly HomeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newArticleBtn = page.locator(".nav-item", {
      hasText: " New Article ",
    });
    this.HomeBtn = page.locator(".nav-item", { hasText: " Home" });
  }

  async clickNewArticle() {
    await this.newArticleBtn.click();
  }
  async clickHomeBtn() {
    await this.HomeBtn.click();
  }
}
