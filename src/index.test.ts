import { screen } from "@testing-library/dom";

import { OFFICIAL_BODY } from "@tests/jest.constants";

describe("index.ts", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      document.body.innerHTML = OFFICIAL_BODY;

      require("./index.ts");
      document.dispatchEvent(new Event("DOMContentLoaded"));
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("It must render the page title, description, image and counter.", () => {
      const title = screen.getByRole("heading", {
        name: "OLD IPHONE GIVEAWAY",
      });
      const description = screen.getByRole("heading", {
        name: /giveaway ends/i,
      });
      const img = screen.getByRole("img");
      const daysText = screen.getByText("Days");
      const hoursText = screen.getByText("Hours");
      const minsText = screen.getByText("Mins");
      const secsText = screen.getByText("Secs");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "./src/assets/cell.png");
      expect(img).toHaveAttribute("alt", "iphone");
      expect(daysText).toBeInTheDocument();
      expect(hoursText).toBeInTheDocument();
      expect(minsText).toBeInTheDocument();
      expect(secsText).toBeInTheDocument();
    });
  });
});
