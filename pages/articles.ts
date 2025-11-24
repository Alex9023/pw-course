import { expect, type Locator, type Page } from "@playwright/test";
export default class Articles {
  readonly page: Page;
  readonly newArticleBtn: Locator;
  readonly articleTitleInput: Locator;
  readonly articleDescriptionInput: Locator;
  readonly articleBodyInput: Locator;
  readonly publishArticleBtn: Locator;
  readonly articleTagInput: Locator;
  readonly tags: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newArticleBtn = page.getByText(" New Article ");
    this.articleTitleInput = page.locator('[formcontrolname="title"]');
    this.articleDescriptionInput = page.locator(
      '[formcontrolname="description"]'
    );
    this.articleBodyInput = page.locator('[formcontrolname="body"]');
    this.publishArticleBtn = page.getByRole("button", {
      name: " Publish Article ",
    });
    this.articleTagInput = page.getByPlaceholder("Enter tags");
    this.tags = page.locator(".tag-list");
  }

  async fillArticleTitle(text: string) {
    await this.articleTitleInput.fill(text);
  }
  async fillArticleDescription(text: string) {
    await this.articleDescriptionInput.fill(text);
  }
  async fillArticleBody(text: string) {
    await this.articleBodyInput.fill(text);
  }
  async clickPublishArticle() {
    await this.publishArticleBtn.click();
  }
  async addTag(text: string) {
    await this.articleTagInput.fill(text);
    await this.page.keyboard.press("Enter");
    await expect(this.tags).toContainText(text);
  }
}
