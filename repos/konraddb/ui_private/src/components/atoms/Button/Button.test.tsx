import { composeStories } from "@storybook/testing-react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./Button.stories";

const { AllButtonStates } = composeStories(stories);

describe("Buttons", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("click should not flip the normal button state to 'complete'", async () => {
    render(<AllButtonStates />);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const button = screen.getAllByRole("button")[0];
    await user.click(button);

    expect(button).not.toBeDisabled();

    act(() => jest.advanceTimersByTime(5000));

    expect(button).not.toBeDisabled();

    jest.useRealTimers();
  });

  test("click should flip the button state to 'complete'", async () => {
    render(<AllButtonStates />);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const button = screen.getAllByRole("button")[12];
    await user.click(button);

    expect(button).toBeDisabled();

    act(() => jest.advanceTimersByTime(5000));

    expect(button).not.toBeDisabled();

    jest.useRealTimers();
  });
});
