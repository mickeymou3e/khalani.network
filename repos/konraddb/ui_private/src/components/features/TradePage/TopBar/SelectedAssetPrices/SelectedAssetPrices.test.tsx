import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./SelectedAssetPrices.stories";

const { NoPrices, WithPrices } = composeStories(stories);

describe("SelectedAssetPrices", () => {
  test("should render the component with no prices", () => {
    render(<NoPrices />);

    checkScreenTexts(["Market Price", "Buy", "Sell"]);

    expect(screen.queryAllByText("-")).toHaveLength(3);
  });

  test("should render the component with prices", () => {
    render(<WithPrices />);

    checkScreenTexts(["28,043.57", "28,092.65", "27,994.49"]);
  });
});
