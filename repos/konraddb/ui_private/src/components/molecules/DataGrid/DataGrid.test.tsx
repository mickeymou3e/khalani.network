import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./DataGrid.stories";

const {
  PlainGridWithRowClick,
  InvisibleNameColumn,
  EmptyGrid,
  CustomChild,
  GridWithRenderers,
  LargeDataWithoutPagination,
  LargeDataWithPagination,
  CollapsibleGrid,
} = composeStories(stories);

describe("DataGrid", () => {
  test("should render the default grid", () => {
    render(<PlainGridWithRowClick />);

    checkScreenTexts([
      "Dessert (100g serving)",
      "Calories",
      "Fat (g)",
      "Carbs (g)",
      "Frozen yogurt",
      "159",
      "12.4",
      "20.6",
      "Ice cream sandwich",
      "120",
      "22.4",
      "10.5",
      "Eclair",
      "300",
      "11.1",
      "50.9",
    ]);
  });

  test("should render the grid without the first column", () => {
    render(<InvisibleNameColumn />);

    expect(
      screen.queryByText("Dessert (100g serving)")
    ).not.toBeInTheDocument();
  });

  test("should render the grid and an empty indicator when there is no data provided", () => {
    render(<EmptyGrid />);

    expect(screen.queryByText("No data visible")).toBeInTheDocument();
  });

  test("should render a custom child", () => {
    render(<CustomChild />);

    expect(screen.queryByText("Custom child")).toBeInTheDocument();
  });

  test("should render components within cells", () => {
    render(<GridWithRenderers />);

    expect(screen.queryAllByText("Close All")).toHaveLength(1);
    expect(screen.queryAllByText("Close")).toHaveLength(3);
    expect(screen.queryAllByTestId("ShareOutlinedIcon")).toHaveLength(3);
  });

  test("should render the grid with scrollbar", () => {
    render(<LargeDataWithoutPagination />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  test("should render the grid with pagination", () => {
    render(<LargeDataWithPagination />);

    expect(screen.queryByTestId("pagination")).toBeInTheDocument();
  });

  test("should render the grid with sub contents", () => {
    render(<CollapsibleGrid />);

    expect(screen.queryByText("Frank")).not.toBeInTheDocument();

    const [, , expandButton] = screen.getAllByTestId(
      "KeyboardArrowDownOutlinedIcon"
    );
    fireEvent.click(expandButton);

    expect(screen.queryByText("Frank")).toBeInTheDocument();
  });
});
