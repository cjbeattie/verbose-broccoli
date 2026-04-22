import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:4000/api/facts/random";

// Scenario: A broccoli fact is displayed on page load
test("a broccoli fact is displayed on page load", async ({ page }) => {
  await page.route(API_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ fact: "Broccoli is a superfood packed with vitamins." }),
    })
  );

  await page.goto("/");

  await expect(page.getByText("Broccoli is a superfood packed with vitamins.")).toBeVisible();
});

// Scenario: I can fetch a new fact
test("clicking 'Give me another one' displays a different fact", async ({ page }) => {
  let callCount = 0;
  const facts = [
    "Broccoli is a superfood packed with vitamins.",
    "Broccoli originated in Italy over 2,000 years ago.",
  ];

  await page.route(API_URL, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ fact: facts[callCount++ % facts.length] }),
    });
  });

  await page.goto("/");
  await expect(page.getByText(facts[0])).toBeVisible();

  await page.getByRole("button", { name: "Give me another one" }).click();

  await expect(page.getByText(facts[1])).toBeVisible();
});

// Scenario: An error message is shown when the API is unavailable
test("an error message is shown when the API is unavailable", async ({ page }) => {
  await page.route(API_URL, (route) =>
    route.fulfill({ status: 500 })
  );

  await page.goto("/");

  // TanStack Query retries 3 times with exponential backoff before throwing to the ErrorBoundary
  await expect(
    page.getByText("The broccoli is unavailable. Please try again later.")
  ).toBeVisible({ timeout: 15000 });
});
