import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./Holdings.stories";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const { LoggedOut, EmptyLists, PopulatedLists } = composeStories(stories);

describe("OrderBook", () => {
  describe("logged out state", () => {
    it("should render the component with open orders selected", () => {
      render(<LoggedOut />);

      checkScreenTexts(["Open Orders", "Trade History", "Portfolio"]);
      checkScreenTexts(["Login to start trading"]);
    });

    it("should navigate between tabs and check the call to login action message and the presence of the checbox on the last tab", async () => {
      render(<LoggedOut />);

      expect(screen.queryByText("Login to start trading")).toBeInTheDocument();
      expect(screen.queryByText("Hide zero balances")).not.toBeInTheDocument();

      const secondButton = screen.getByText("Trade History");
      const user = userEvent.setup();
      await user.click(secondButton);

      expect(screen.queryByText("Login to review history")).toBeInTheDocument();
      expect(screen.queryByText("Hide zero balances")).not.toBeInTheDocument();

      const thirdButton = screen.getByText("Portfolio");
      await user.click(thirdButton);
    });
  });

  describe("logged in state, empty lists", () => {
    it("should check all lists if they are empty", async () => {
      render(<EmptyLists />);

      expect(screen.queryByText("No orders yet")).toBeInTheDocument();

      const secondButton = screen.getByText("Trade History");
      const user = userEvent.setup();
      await user.click(secondButton);

      expect(screen.queryByText("No history yet")).toBeInTheDocument();

      const thirdButton = screen.getByText("Portfolio");
      await user.click(thirdButton);

      expect(screen.queryByText("No portfolio yet")).toBeInTheDocument();
    });
  });

  describe("logged in state, populated lists", () => {
    it("should check all lists if they are populated", async () => {
      render(<PopulatedLists />);

      // TODO
      checkScreenTexts([
        "2023-11-16",
        "JLT-F23/EUR",
        "Buy",
        "Limit",
        "11.00",
        "1.00 EUR",
        "11.00 EUR",
        "Not filled",
        "Cancel",
      ]);

      const secondButton = screen.getByText("Trade History");
      const user = userEvent.setup();
      await user.click(secondButton);

      checkScreenTexts([
        "2023-07-05",
        "ETH/EUR",
        "Sell",
        "Market",
        "1.0000",
        "1,750.85 EUR",
        "-",
        "Filled",
        "Details",
      ]);

      const thirdButton = screen.getByText("Portfolio");
      await user.click(thirdButton);

      checkScreenTexts(["EUR", "Euro", "1,000.25", "10.00", "1,010.25"]);
    });
  });
});
