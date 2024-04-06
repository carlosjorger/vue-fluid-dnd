import { test, expect, Page } from "@playwright/test";

let page: Page;
const li_with_child_elements =
  "ul#example-vertical-list-with-child-elements > li";
test("drag and drop top-down", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(li_with_child_elements)).toHaveText([
    "1 1234",
    "2 2345",
    "3 3456",
    "4 4567",
    "5 5678",
    "6 6789",
  ]);
  await page.waitForTimeout(2000);
  await dragDrop(page, "#child-with-children-1", "#child-with-children-6");
  await expect(page.locator(li_with_child_elements)).toHaveText(
    ["2 2345", "3 3456", "4 4567", "5 5678", "6 6789", "1 1234"],
    {
      timeout: 20000,
    }
  );
});
test("drag and drop down-top", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(li_with_child_elements)).toHaveText([
    "1 1234",
    "2 2345",
    "3 3456",
    "4 4567",
    "5 5678",
    "6 6789",
  ]);
  await page.waitForTimeout(2000);
  await dragDrop(page, "#child-with-children-6", "#child-with-children-1");
  await expect(page.locator(li_with_child_elements)).toHaveText(
    ["6 6789", "1 1234", "2 2345", "3 3456", "4 4567", "5 5678"],
    { timeout: 20000 }
  );
});
async function dragDrop(
  page: Page,
  originSelector: string,
  destinationSelector: string
) {
  const originElement = await page.waitForSelector(originSelector);
  const destinationElement = await page.waitForSelector(destinationSelector);
  const originElementBox = await originElement.boundingBox();
  const destinationElementBox = await destinationElement.boundingBox();
  if (!originElementBox || !destinationElementBox) {
    return;
  }
  const yError = originElementBox.y < destinationElementBox.y ? 21 : -21;
  await page.mouse.move(
    originElementBox.x + originElementBox.width / 2,
    originElementBox.y + originElementBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    destinationElementBox.x + destinationElementBox.width / 2,
    destinationElementBox.y + destinationElementBox.height / 2 + yError,
    { steps: 20 }
  );
  await page.mouse.up();
}
// TODO: pass playwright to main project
