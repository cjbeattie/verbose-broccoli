import { test, expect } from "@playwright/test";

const CREATE_POLL_URL = "http://localhost:4000/api/poll";
const VOTE_URL = "http://localhost:4000/api/vote";
const POLL_URL_PATTERN = "http://localhost:4000/api/poll/*";

const mockPoll = {
  id: "test-poll-id-123",
  question: "What is your favourite colour?",
  options: [
    { text: "Red", votes: 3 },
    { text: "Blue", votes: 5 },
  ],
  your_vote: null,
  created_at: "2026-04-23T12:00:00Z",
};

const mockPollAfterVote = {
  ...mockPoll,
  options: [
    { text: "Red", votes: 4 },
    { text: "Blue", votes: 5 },
  ],
  your_vote: 0,
};

const mockPollAlreadyVoted = {
  ...mockPoll,
  your_vote: 1,
};

test.describe("Poll App", () => {
  // Scenario: Create a poll and land on the vote page
  test("creates a poll and redirects to the vote page", async ({ page }) => {
    await page.route(CREATE_POLL_URL, (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ ...mockPoll, your_vote: null }),
      })
    );

    await page.route(POLL_URL_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ...mockPoll, your_vote: null }),
      })
    );

    await page.goto("/");

    await page.fill("#question", "What is your favourite colour?");
    await page.locator(".option-row input").nth(0).fill("Red");
    await page.locator(".option-row input").nth(1).fill("Blue");

    await page.getByRole("button", { name: "Create Poll" }).click();

    await expect(page).toHaveURL(`/${mockPoll.id}`);
    await expect(
      page.getByText("What is your favourite colour?")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Vote" })).toBeVisible();
  });

  // Scenario: Vote on a poll
  test("voting transitions to the results view", async ({ page }) => {
    await page.route(POLL_URL_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockPoll),
      })
    );

    await page.route(VOTE_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockPollAfterVote),
      })
    );

    await page.goto(`/${mockPoll.id}`);

    await expect(page.getByRole("button", { name: "Vote" })).toBeVisible();
    await page.locator('input[name="vote"]').first().click();
    await page.getByRole("button", { name: "Vote" }).click();

    await expect(page.getByText("Red ✓")).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  });

  // Scenario: Cannot vote twice on the same poll
  test("already voted shows results without vote form", async ({ page }) => {
    await page.route(POLL_URL_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockPollAlreadyVoted),
      })
    );

    await page.goto(`/${mockPoll.id}`);

    await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vote" })).not.toBeVisible();
    await expect(page.getByText("Blue ✓")).toBeVisible();
  });

  // Scenario: Add and remove options when creating a poll
  test("can add and remove option inputs", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".option-row input")).toHaveCount(2);

    await page.getByRole("button", { name: "+ Add option" }).click();
    await expect(page.locator(".option-row input")).toHaveCount(3);

    await page.locator(".btn-remove").last().click();
    await expect(page.locator(".option-row input")).toHaveCount(2);
  });

  // Scenario: Creating a poll with an empty question shows an error
  test("form requires a question to submit", async ({ page }) => {
    await page.goto("/");

    await page.locator(".option-row input").nth(0).fill("Yes");
    await page.locator(".option-row input").nth(1).fill("No");

    await page.getByRole("button", { name: "Create Poll" }).click();

    // Native HTML5 validation prevents submission — we stay on "/"
    await expect(page).toHaveURL("/");
  });
});
