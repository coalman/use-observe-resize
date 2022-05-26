import {
  type Locator,
  type Page,
  test as baseTest,
  expect,
} from "@playwright/test";

class ResizableBoxLocator {
  #page: Page;
  #locator: Locator;

  constructor(page: Page, locator: Locator) {
    this.#page = page;
    this.#locator = locator;
  }

  async resize(dir: "left" | "right" | "up" | "down") {
    const capitalizedDir = dir.substring(0, 1).toUpperCase() + dir.substring(1);
    await this.#locator.press(`Arrow${capitalizedDir}`);
    await this.#page.waitForTimeout(100);
  }

  async readSizeRecords(): Promise<{ width: number; height: number }[]> {
    return this.#locator.evaluate((box) => box.readSizeRecords());
  }
}

const test = baseTest.extend({
  boxes: async ({ page }, use) => {
    await page.goto("http://localhost:3000/resizable-boxes/");
    const locators = [
      new ResizableBoxLocator(page, page.locator(`data-testid=box1`)),
      new ResizableBoxLocator(page, page.locator(`data-testid=box2`)),
      new ResizableBoxLocator(page, page.locator(`data-testid=box3`)),
    ];
    await use(locators);
  },
});

test("resizing unrelated elements shouldn't cause observations", async ({
  boxes: [box1, box2, box3],
}) => {
  // check initial size observations.
  expect(await box1.readSizeRecords()).toEqual([{ width: 300, height: 300 }]);
  expect(await box2.readSizeRecords()).toEqual([{ width: 200, height: 200 }]);
  expect(await box3.readSizeRecords()).toEqual([{ width: 100, height: 100 }]);

  await box1.resize("left");

  expect(await box1.readSizeRecords()).toEqual([{ width: 290, height: 300 }]);
  // resizing box1 shouldn't affect box2 or box3
  expect(await box2.readSizeRecords()).toEqual([]);
  expect(await box3.readSizeRecords()).toEqual([]);

  await box2.resize("up");
  expect(await box1.readSizeRecords()).toEqual([]);
  expect(await box2.readSizeRecords()).toEqual([{ width: 200, height: 190 }]);
  expect(await box3.readSizeRecords()).toEqual([]);

  await box3.resize("down");
  expect(await box1.readSizeRecords()).toEqual([]);
  expect(await box2.readSizeRecords()).toEqual([]);
  expect(await box3.readSizeRecords()).toEqual([{ width: 100, height: 110 }]);
});

test("multiple sequential resizes can be observed on one element", async ({
  page,
  boxes: [box],
}) => {
  const resizes = [
    [undefined, { width: 300, height: 300 }],
    ["left", { width: 290, height: 300 }],
    ["right", { width: 300, height: 300 }],
    ["up", { width: 300, height: 290 }],
    ["down", { width: 300, height: 300 }],
  ] as const;

  for (const [dir] of resizes) {
    if (dir) {
      await box.resize(dir);
    }
  }

  expect(await box.readSizeRecords()).toEqual(resizes.map((value) => value[1]));
});
