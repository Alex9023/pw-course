import { request, test as setup } from "@playwright/test";
import { expect } from "@playwright/test";
import { UI_URL, VALID_USER } from "../utils.config";
import { API_URL } from "../utils.config";
import user from "../.auth/user.json";
import fs from "fs";

const authFile = ".auth/user.json";

setup("auth setup", async ({ browser, request }) => {
  // await page.goto("/");
  // await page.locator('[routerlink="/login"]', { hasText: "Sign In" }).click();
  // await page.locator('[formcontrolname="email"]').fill(VALID_USER.email);
  // await page.locator('[formcontrolname="password"]').fill(VALID_USER.password);
  // await page.locator('[type="submit"]', { hasText: "Sign in" }).click();
  // const signInResponse = await page.waitForResponse(
  //   `${API_URL}/api/users/login`
  // );
  // expect(signInResponse.status()).toEqual(200);
  // await page.context().storageState({ path: authFile });
  ///
  const signInResponse = await request.post(`${API_URL}/api/users/login`, {
    data: {
      user: {
        email: VALID_USER.email,
        password: VALID_USER.password,
      },
    },
  });
  expect(signInResponse.status()).toEqual(200);
  const SignInResBody = await signInResponse.json();
  const token = SignInResBody.user.token;
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(UI_URL);
  await page.evaluate((token) => {
    localStorage.setItem("jwtToken", token);
  }, token);
  await context.storageState({ path: authFile });
  await context.close();
  process.env["ACCESS_TOKEN"] = token;
});
