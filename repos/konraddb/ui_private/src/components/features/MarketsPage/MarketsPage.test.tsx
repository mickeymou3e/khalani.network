import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./MarketsPage.stories";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const { LoggedOutView, LoggedInView } = composeStories(stories);

describe("Markets Page", () => {
  describe("Render", () => {
    it("should render logged out view, which shows asset details and prices except for the last price", () => {
      render(<LoggedOutView />);

      checkScreenTexts(["JLT-F23/EUR", "JLT-F23", "2.03", "2.04", "2.02"]);
      checkScreenTexts(["25,500.12", "1,751.21", "6.70"], false);
    });

    it("should render logged in view, which shows all details", () => {
      render(<LoggedInView />);

      checkScreenTexts([
        "BTC/EUR",
        "Bitcoin",
        "ETH/EUR",
        "Ethereum",
        "ATOM/EUR",
        "Cosmos",
        "JLT-F23/EUR",
        "JLT-F23",
        "28,043.57",
        "28,092.65",
        "27,994.49",
        "1,759.23",
        "1,761.87",
        "1,756.58",
        "8.60",
        "8.62",
        "8.59",
        "2.03",
        "2.04",
        "2.02",
      ]);
    });
  });

  describe("Interactions", () => {
    let pushMock: typeof jest.fn;

    beforeEach(() => {
      const useRouter = jest.spyOn(require("next/router"), "useRouter");

      pushMock = jest.fn();
      useRouter.mockImplementation(() => ({
        query: {},
        push: pushMock,
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should click on Trade buttons", async () => {
      render(<LoggedInView />);

      const [firstButton, secondButton, thirdButton] =
        screen.queryAllByText("trade");
      const user = userEvent.setup();

      await user.click(firstButton);
      expect(pushMock).toBeCalledWith("/trade/BTC_EUR");

      await user.click(secondButton);
      expect(pushMock).toBeCalledWith("/trade/ETH_EUR");

      await user.click(thirdButton);
      expect(pushMock).toBeCalledWith("/trade/ATOM_EUR");
    });
  });
});
