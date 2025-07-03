import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./AssetSelect.stories";

const { DetailedView } = composeStories(stories);

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("AssetSelect", () => {
  describe("detailed view", () => {
    test("should render the component with collapsed menu", () => {
      render(<DetailedView />);

      expect(screen.queryAllByRole("presentation")).toHaveLength(0);
    });

    test("should render the component with opened menu and check if everything is on the data grid", async () => {
      render(<DetailedView />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("BTC/EUR")[0]);

      expect(screen.queryAllByRole("presentation")).toHaveLength(1);

      checkScreenTexts([
        "BTC/EUR",
        "Bitcoin",
        "28,043.57",
        "28,092.65",
        "27,994.49",
      ]);
      checkScreenTexts([
        "ETH/EUR",
        "Ethereum",
        "1,759.23",
        "1,761.87",
        "1,756.58",
      ]);
      checkScreenTexts(["ATOM/EUR", "Cosmos", "8.60", "8.62", "8.59"]);
    });
  });
});
