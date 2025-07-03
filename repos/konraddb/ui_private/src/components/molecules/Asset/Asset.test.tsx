import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./Asset.stories";

const {
  TokenAssets,
  PairAsset,
  TokenAssetsWithDescription,
  CurrencyAsset,
  NoAssets,
} = composeStories(stories);

describe("ProductAsset", () => {
  test("renders token assets without description", () => {
    render(<TokenAssets />);

    expect(screen.getByText("BTC/USD")).toBeInTheDocument();
    expect(screen.queryByText("Bitcoin/US Dollar")).not.toBeInTheDocument();
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
    expect(screen.getByAltText("BTC")).toBeInTheDocument();
  });

  test("renders pair asset with description", () => {
    render(<PairAsset />);

    expect(screen.getByText("BTC/USD")).toBeInTheDocument();
    expect(screen.queryByText("Bitcoin/US Dollar")).not.toBeInTheDocument();
    expect(screen.queryByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByAltText("BTC/USD")).toBeInTheDocument();
  });

  test("renders token assets with description", () => {
    render(<TokenAssetsWithDescription />);

    expect(screen.getByText("BTC/USD")).toBeInTheDocument();
    expect(screen.queryByText("Bitcoin/US Dollar")).toBeInTheDocument();
    expect(screen.getByAltText("BTC")).toBeInTheDocument();
  });

  test("renders market asset", () => {
    render(<CurrencyAsset />);

    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByAltText("USD")).toBeInTheDocument();
  });

  test("does not render anything if assets are not provided", () => {
    render(<NoAssets />);

    expect(screen.queryByText("Unknown")).not.toBeInTheDocument();
  });
});
