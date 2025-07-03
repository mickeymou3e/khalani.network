import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./PasswordInput.stories";

const { PasswordInputs } = composeStories(stories);

describe("PasswordInput", () => {
  describe("Interactions", () => {
    test("Default type of the input should be 'password'", () => {
      render(<PasswordInputs />);

      const input = screen.getAllByDisplayValue(
        "Secret password"
      )[0] as HTMLInputElement;

      expect(input.type).toBe("password");
    });

    test("Change input's value", () => {
      render(<PasswordInputs />);

      const input = screen.getAllByDisplayValue(
        "Secret password"
      )[0] as HTMLInputElement;

      fireEvent.change(input, { target: { value: "New Secret pwd" } });

      expect(input.value).toBe("New Secret pwd");
    });

    test("Clicking on the show/hide password button should alternate the input's type", async () => {
      render(<PasswordInputs />);

      const input = screen.getAllByDisplayValue(
        "Secret password"
      )[0] as HTMLInputElement;
      const firstButton = screen.getAllByRole("button")[0];

      const user = userEvent.setup();
      await user.click(firstButton);

      expect(input.type).toBe("text");

      await user.click(firstButton);

      expect(input.type).toBe("password");
    });
  });
});
