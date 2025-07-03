import { composeStories } from "@storybook/testing-react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import * as stories from "./InputBase.stories";

const {
  InputAlone,
  InputWithProducts,
  InputWithTrailingText,
  InputWithEndAdornment,
  InputWithTopLabel,
  InputWithBottomLabel,
} = composeStories(stories);

describe("Input", () => {
  describe("Display variants", () => {
    test("renders Input only, without any extra addons", () => {
      render(<InputAlone />);

      expect(screen.getByDisplayValue("Input text")).toBeInTheDocument();

      expect(screen.queryAllByText("BTC")).toHaveLength(0);
      expect(screen.queryAllByText("USD")).toHaveLength(0);
      expect(screen.queryAllByText("Input Label")).toHaveLength(0);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(0);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(0);
    });

    test("renders Input with an asset on the left", () => {
      render(<InputWithProducts />);

      expect(screen.queryAllByText("BTC")).toHaveLength(4);

      expect(screen.queryAllByText("USD")).toHaveLength(0);
      expect(screen.queryAllByText("Input Label")).toHaveLength(0);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(0);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(0);
    });

    test("renders Input with a static text on the right", () => {
      render(<InputWithTrailingText />);

      expect(screen.queryAllByText("USD")).toHaveLength(4);

      expect(screen.queryAllByText("BTC")).toHaveLength(0);
      expect(screen.queryAllByText("Input Label")).toHaveLength(0);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(0);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(0);
    });

    test("renders Input with a button on the right", () => {
      render(<InputWithEndAdornment />);

      expect(screen.queryAllByText("Max")).toHaveLength(4);

      expect(screen.queryAllByText("BTC")).toHaveLength(0);
      expect(screen.queryAllByText("Input Label")).toHaveLength(0);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(0);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(0);
    });

    test("renders Input with top labels", () => {
      render(<InputWithTopLabel />);

      expect(screen.queryAllByText("Input Label")).toHaveLength(4);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(4);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(4);

      expect(screen.queryAllByText("BTC")).toHaveLength(0);
      expect(screen.queryAllByText("USD")).toHaveLength(0);
    });

    test("renders Input with bottom labels", () => {
      render(<InputWithBottomLabel />);

      expect(screen.queryAllByText("Input Label")).toHaveLength(4);
      expect(screen.queryAllByText("Secondary Label")).toHaveLength(4);
      expect(screen.queryAllByText("Tertiary Label")).toHaveLength(4);

      expect(screen.queryAllByText("BTC")).toHaveLength(0);
      expect(screen.queryAllByText("USD")).toHaveLength(0);
    });
  });

  describe("Interactions", () => {
    test("Write text into input", async () => {
      render(<InputAlone />);

      const input: HTMLInputElement =
        screen.getByPlaceholderText("Placeholder text");

      fireEvent.change(input, { target: { value: "23" } });

      expect(input.value).toBe("23");
    });

    test("should handle focus correctly", async () => {
      render(<InputAlone />);

      const input: HTMLInputElement =
        screen.getByPlaceholderText("Placeholder text");

      expect(input).not.toHaveFocus();

      act(() => input.focus());

      expect(input).toHaveFocus();
    });
  });
});
