import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./BaseAsset.stories";

const {
  SingleAsset,
  SingleAssetWithOverrideLabel,
  SingleAssetWithoutLabel,
  SingleAssetWithoutIcon,
  PairAssets,
  PairAssetsWithDescription,
  PairAssetsWithOverrideLabel,
  PairAssetsWithoutLabel,
} = composeStories(stories);

describe("BaseAsset", () => {
  test("SingleAsset", () => {
    render(<SingleAsset />);

    expect(screen.queryAllByText("BTC")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset with override label", () => {
    render(<SingleAssetWithOverrideLabel />);

    expect(screen.queryAllByText("Single Asset")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset without label", () => {
    render(<SingleAssetWithoutLabel />);

    expect(screen.queryAllByText("BTC")).toHaveLength(0);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset without icon", () => {
    render(<SingleAssetWithoutIcon />);

    expect(screen.queryAllByText("BTC")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(0);
  });

  test("PairAssets without description", () => {
    render(<PairAssets />);

    expect(screen.queryAllByText("BTC/ETH")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
    expect(screen.queryAllByText("Bitcoin/Ethereum")).toHaveLength(0);
  });

  test("PairAssets with description", () => {
    render(<PairAssetsWithDescription />);

    expect(screen.queryAllByText("BTC/ETH")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
    expect(screen.queryAllByText("Bitcoin/Ethereum")).toHaveLength(1);
  });

  test("PairAssets with override label", () => {
    render(<PairAssetsWithOverrideLabel />);

    expect(screen.queryAllByText("Pair Assets")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("PairAssets without label", () => {
    render(<PairAssetsWithoutLabel />);

    expect(screen.queryAllByText("BTC")).toHaveLength(0);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });
});
