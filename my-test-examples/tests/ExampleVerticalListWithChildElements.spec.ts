import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("/");
});
test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("ul > li")).toHaveText([
    "1 1234",
    "2 2345",
    "3 3456",
    "4 4567",
    "5 5678",
    "6 6789",
  ]);
});
//TODO Add drag and drop from top and from bottom
test("drag and drop top-down", async ({ page }) => {
  await page
    .locator("#child-with-children-1")
    .dragTo(page.locator("#child-with-children-6"));
});
