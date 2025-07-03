import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";

import * as stories from "./Checkbox.stories";

const { WithLabel, WithoutLabel } = composeStories(stories);

describe("Checkbox", () => {
  it("renders Checkbox component without label", () => {
    render(<WithoutLabel />);

    expect(screen.queryAllByRole("checkbox")).toHaveLength(4);
    expect(screen.queryByText("Label")).not.toBeInTheDocument();
  });

  it("renders Checkbox component with label", () => {
    render(<WithLabel />);

    expect(screen.queryAllByText("Label")).toHaveLength(4);
  });
});
