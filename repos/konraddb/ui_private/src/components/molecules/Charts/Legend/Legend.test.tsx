import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./Legend.stories";

const { NoValues, Populated, Interactive } = composeStories(stories);

describe("Pie Chart", () => {
  it("should render an list if no values are present", () => {
    render(<NoValues />);

    expect(screen.getByTestId("PieChartOutlineSharpIcon")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should render a populated list", () => {
    render(<Populated />);

    expect(
      screen.queryByTestId("PieChartOutlineSharpIcon")
    ).not.toBeInTheDocument();

    checkScreenTexts([
      "BTC",
      "30%",
      "30.00 EUR",
      "ETH",
      "20%",
      "20.00 EUR",
      "USDT",
      "10%",
      "10.00 EUR",
      "USDC",
      "35%",
      "35.00 EUR",
      "XRP",
      "5%",
      "5.00 EUR",
    ]);
  });

  it("should render a list and call mouse event handlers", () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    render(
      <Interactive onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
    );

    const [secondRow] = screen.getAllByText("ETH");

    fireEvent.mouseOver(secondRow);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(1);

    fireEvent.mouseOut(secondRow);

    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
