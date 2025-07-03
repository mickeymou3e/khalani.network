import { composeStories } from "@storybook/react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./SearchInput.stories";

const { SearchInputs } = composeStories(stories);

describe("SearchInput", () => {
  describe("Rendering", () => {
    test("renders all variants", () => {
      const { container } = render(<SearchInputs />);

      expect(
        container.querySelector("input[value='Search text']")
      ).toBeDefined();
      expect(
        container.querySelector("input[placeholder='Placeholder text']")
      ).toBeDefined();
      expect(
        container.querySelector("input[value='Disabled text']")
      ).toBeDefined();
    });
  });

  describe("Interactions", () => {
    test("Write text into input", () => {
      render(<SearchInputs />);

      const input: HTMLInputElement = screen.getByDisplayValue("Search Text");

      fireEvent.change(input, { target: { value: "23" } });

      expect(input.value).toBe("23");
    });

    test("Clear contents", async () => {
      render(<SearchInputs />);

      const input: HTMLInputElement = screen.getByDisplayValue("Search Text");
      const user = userEvent.setup();
      await user.click(screen.getAllByRole("button")[0]);

      expect(input.value).toBe("");
    });
  });
});
