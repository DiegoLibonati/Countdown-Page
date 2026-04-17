import { screen } from "@testing-library/dom";

import type { CountdownProps } from "@/types/props";
import type { CountdownComponent } from "@/types/components";

import Countdown from "@/components/Countdown/Countdown";

const defaultProps: CountdownProps = {
  id: "days",
  count: "05",
  title: "Days",
};

const renderComponent = (
  props: Partial<CountdownProps> = {}
): CountdownComponent => {
  const element = Countdown({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Countdown", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should render the count value", () => {
      renderComponent();
      expect(screen.getByText("05")).toBeInTheDocument();
    });

    it("should render the title", () => {
      renderComponent();
      expect(screen.getByText("Days")).toBeInTheDocument();
    });

    it("should set the id on the root element", () => {
      const element = renderComponent();
      expect(element.id).toBe("days");
    });

    it("should set the aria-label combining count and title", () => {
      const element = renderComponent();
      expect(element).toHaveAttribute("aria-label", "05 Days");
    });
  });

  describe("with different props", () => {
    it("should render a different count value", () => {
      renderComponent({ count: "12", title: "Hours", id: "hours" });
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should render a different title", () => {
      renderComponent({ count: "30", title: "Mins", id: "mins" });
      expect(screen.getByText("Mins")).toBeInTheDocument();
    });

    it("should set a different id", () => {
      const element = renderComponent({
        id: "secs",
        count: "00",
        title: "Secs",
      });
      expect(element.id).toBe("secs");
    });

    it("should update the aria-label with the new count and title", () => {
      const element = renderComponent({
        count: "59",
        title: "Secs",
        id: "secs",
      });
      expect(element).toHaveAttribute("aria-label", "59 Secs");
    });
  });

  describe("edge cases", () => {
    it("should render count 00", () => {
      renderComponent({ count: "00" });
      expect(screen.getByText("00")).toBeInTheDocument();
    });

    it("should set aria-label to 00 Days when count is 00", () => {
      const element = renderComponent({ count: "00" });
      expect(element).toHaveAttribute("aria-label", "00 Days");
    });
  });
});
