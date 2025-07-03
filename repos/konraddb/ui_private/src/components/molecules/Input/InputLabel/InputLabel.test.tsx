import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./InputLabel.stories";

const { InputLabel, WithSecondaryLabel, AllLabels } = composeStories(stories);

describe("InputLabel", () => {
  test("renders one label", () => {
    render(<InputLabel />);

    expect(screen.queryByText("Input Label")).toBeInTheDocument();
    expect(screen.queryByText("Secondary Label")).not.toBeInTheDocument();
    expect(screen.queryByText("Tertiary Label")).not.toBeInTheDocument();
  });

  test("renders two labels", () => {
    render(<WithSecondaryLabel />);

    expect(screen.queryByText("Input Label")).toBeInTheDocument();
    expect(screen.queryByText("Secondary Label")).toBeInTheDocument();
    expect(screen.queryByText("Tertiary Label")).not.toBeInTheDocument();
  });

  test("renders all labels", () => {
    render(<AllLabels />);

    expect(screen.queryByText("Input Label")).toBeInTheDocument();
    expect(screen.queryByText("Secondary Label")).toBeInTheDocument();
    expect(screen.queryByText("Tertiary Label")).toBeInTheDocument();
  });
});
