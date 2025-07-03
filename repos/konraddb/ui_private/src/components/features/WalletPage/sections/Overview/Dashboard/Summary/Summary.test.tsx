import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./Summary.stories";

const { NoBalances, WithBalances, WithBalancesHiddenValues } =
  composeStories(stories);

describe("Summary", () => {
  it("should render a summary with no balances", () => {
    render(<NoBalances />);

    checkScreenTexts(["0.00 EUR"]);
  });

  it("should render a summary with balances", () => {
    render(<WithBalances />);

    checkScreenTexts(["1,517.75 EUR"]);
  });

  it("should render a summary with balances and hidden values", () => {
    render(<WithBalancesHiddenValues />);

    checkScreenTexts(["****** EUR"]);
  });
});
