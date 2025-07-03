import React from "react";
import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import * as stories from "./ToggleButtonGroup.stories";

const { Default } = composeStories(stories);

describe("ToggleButtonGroup", () => {
  test("toggles between button states and updates the selected value", () => {
    render(<Default />);

    const leftAlignedButton = screen.getByLabelText("left aligned");
    const centerAlignedButton = screen.getByLabelText("center aligned");
    const rightAlignedButton = screen.getByLabelText("right aligned");

    expect(leftAlignedButton).toHaveClass("Mui-selected");
    expect(centerAlignedButton).not.toHaveClass("Mui-selected");
    expect(rightAlignedButton).not.toHaveClass("Mui-selected");

    fireEvent.click(centerAlignedButton);
    expect(leftAlignedButton).not.toHaveClass("Mui-selected");
    expect(centerAlignedButton).toHaveClass("Mui-selected");
    expect(rightAlignedButton).not.toHaveClass("Mui-selected");
  });
});
