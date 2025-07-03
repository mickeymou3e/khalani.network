import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./Portfolio.stories";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const { NoPortfolio, WithPortfolio, WithPortfolioHiddenValues } =
  composeStories(stories);

describe("Portfolio", () => {
  it("should render a portfolio with no balances", () => {
    render(<NoPortfolio />);

    checkScreenTexts(["No portfolio yet"]);
  });

  it("should render a portfolio with pool balances", async () => {
    render(<WithPortfolio />);

    checkScreenTexts([
      "JLT-F23",
      "200.00",
      "406.00 EUR",
      "250.00",
      "507.50 EUR",
    ]);
  });

  it("should render a portfolio with fiat balances", async () => {
    render(<WithPortfolio />);

    const fiatTab = screen.getByText("Fiat");
    const user = userEvent.setup();
    await user.click(fiatTab);

    checkScreenTexts([
      "EUR",
      "Euro",
      "1,000.25",
      "1,000.25 EUR",
      "1,010.25",
      "1,010.25 EUR",
    ]);
  });

  it("should render a portfolio with pool balances and hidden values", async () => {
    render(<WithPortfolioHiddenValues />);

    checkScreenTexts(["JLT-F23", "JLT-F23", "******", "****** EUR"]);
  });

  it("should render a portfolio with fiat balances and hidden values", async () => {
    render(<WithPortfolioHiddenValues />);

    const fiatTab = screen.getByText("Fiat");
    const user = userEvent.setup();
    await user.click(fiatTab);

    checkScreenTexts(["EUR", "Euro", "******", "****** EUR"]);
  });
});
