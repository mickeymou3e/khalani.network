import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import * as stories from "./FavouriteButton.stories";

const { Default } = composeStories(stories);

describe("FavouriteButton", () => {
  test("should render and change state when button is clicked", () => {
    render(<Default />);

    const [firstButton] = screen.getAllByRole("button");

    expect(screen.getAllByTestId("StarOutlinedIcon")[0]).toBeInTheDocument();

    fireEvent.click(firstButton);

    expect(
      screen.getAllByTestId("StarOutlineOutlinedIcon")[0]
    ).toBeInTheDocument();
  });
});
