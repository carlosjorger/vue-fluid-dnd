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
  await page.goto("/");

  await dragDrop(page, "#child-with-children-1", "#child-with-children-6");
  await expect(page.locator("ul > li")).toHaveText([
    "6 6789",
    "2 2345",
    "3 3456",
    "4 4567",
    "5 5678",
    "1 1234",
  ]);
});
async function dragDrop(
  page: Page,
  originSelector: string,
  destinationSelector: string
) {
  const originElement = await page.waitForSelector(originSelector);
  const destinationElement = await page.waitForSelector(destinationSelector);

  await originElement.hover();
  await page.mouse.down();
  const box = (await destinationElement.boundingBox())!;
  await page.mouse.move(box.x, box.y + box.height / 2, { steps: 5 });
  await destinationElement.hover();
  await page.mouse.up();
}
