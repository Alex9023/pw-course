import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_URL } from "../utils.config";
import Articles from "../pages/articles";
import Navigation from "../components/navMenu";

// test.beforeEach(async ({ page }) => {
//   await page.goto("/");
// });
test("Create a new article with required fields", async ({ page }) => {
  const art = new Articles(page);
  const nav = new Navigation(page);
  const article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  };
  await page.goto("/");
  await nav.clickNewArticle();
  await art.fillArticleTitle(article.title);
  await art.fillArticleDescription(article.description);
  await art.fillArticleBody(article.body);
  const createArticlePromise = page.waitForResponse(`${API_URL}/api/articles/`);
  await art.clickPublishArticle();
  const articleResponse = await createArticlePromise;
  expect(articleResponse.status()).toEqual(201);
  const articleRespBody = await articleResponse.json();
  const articleSlug = articleRespBody.article.slug;
  await page.waitForURL(`/article/${articleSlug}`);
  const articlesPromise = page.waitForResponse(`${API_URL}/api/articles**`);
  await nav.clickHomeBtn();
  const getArticles = await articlesPromise;
  expect(getArticles.status()).toBe(200);
  const articleToCheck = page
    .locator("app-article-list app-article-preview")
    .filter({
      has: page.locator(`[href="/article/${articleSlug}"]`),
    });
  await expect(articleToCheck.locator("h1")).toHaveText(article.title);
  await expect(articleToCheck.locator("p")).toHaveText(article.description);
});

test("Create a new article with tags", async ({ page }) => {
  const art = new Articles(page);
  const nav = new Navigation(page);
  const article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    firstTag: faker.lorem.word(),
    secondTag: faker.lorem.words({ min: 2, max: 3 }),
  };
  await page.goto("/");
  await nav.clickNewArticle();
  await art.fillArticleTitle(article.title);
  await art.fillArticleDescription(article.description);
  await art.fillArticleBody(article.body);
  await art.addTag(article.firstTag);
  await art.addTag(article.secondTag);
  const createArticlePromise = page.waitForResponse(`${API_URL}/api/articles/`);
  await art.clickPublishArticle();
  const articleResponse = await createArticlePromise;
  expect(articleResponse.status()).toEqual(201);
  const articleRespBody = await articleResponse.json();
  console.log(articleRespBody);
  const articleSlug = articleRespBody.article.slug;
  await page.waitForURL(`/article/${articleSlug}`);
  const articlesPromise = page.waitForResponse(`${API_URL}/api/articles**`);
  await nav.clickHomeBtn();
  const getArticles = await articlesPromise;
  expect(getArticles.status()).toBe(200);
  const articleToCheck = page
    .locator("app-article-list app-article-preview")
    .filter({
      has: page.locator(`[href="/article/${articleSlug}"]`),
    });
  await expect(articleToCheck.locator("h1")).toHaveText(article.title);
  await expect(articleToCheck.locator("p")).toHaveText(article.description);
  const articleTags = articleToCheck.locator(art.tags);
  await expect(articleTags).toContainText(article.firstTag);
  await expect(articleTags).toContainText(article.secondTag);
});
