import { screen } from "@testing-library/dom";

import type { CountdownProps } from "@/types/props";
import type { CountdownComponent } from "@/types/components";

import { Countdown } from "@/components/Countdown/Countdown";

const renderComponent = (props: CountdownProps): CountdownComponent => {
  const container = Countdown(props);
  document.body.appendChild(container);
  return container;
};

describe("Countdown", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Render", () => {
    it("should create a div element", () => {
      const container = renderComponent({
        id: "test-countdown",
        count: "10",
        title: "Days",
      });

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.tagName).toBe("DIV");
    });

    it("should have correct styling classes", () => {
      const container = renderComponent({
        id: "test-countdown",
        count: "10",
        title: "Days",
      });

      expect(container).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "flex-col"
      );
    });

    it("should set correct id", () => {
      const container = renderComponent({
        id: "days",
        count: "5",
        title: "Days",
      });

      expect(container.id).toBe("days");
    });

    it("should render count as heading", () => {
      renderComponent({
        id: "hours",
        count: "23",
        title: "Hours",
      });

      const heading = screen.getByRole("heading", { name: "23", level: 4 });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(
        "py-3",
        "px-2",
        "bg-primary",
        "bg-opacity-75",
        "rounded-lg",
        "text-white",
        "font-bold",
        "mb-2"
      );
    });

    it("should render title as span", () => {
      const container = renderComponent({
        id: "mins",
        count: "45",
        title: "Mins",
      });

      const span = container.querySelector<HTMLSpanElement>("span");

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("Mins");
      expect(span).toHaveClass("text-secondary");
    });

    it("should display count and title correctly", () => {
      renderComponent({
        id: "secs",
        count: "30",
        title: "Secs",
      });

      expect(screen.getByRole("heading", { name: "30" })).toBeInTheDocument();
      expect(screen.getByText("Secs")).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("should handle different id values", () => {
      const ids = ["days", "hours", "mins", "secs"];

      ids.forEach((id) => {
        document.body.innerHTML = "";
        const container = renderComponent({
          id,
          count: "0",
          title: "Test",
        });

        expect(container.id).toBe(id);
      });
    });

    it("should handle zero count", () => {
      renderComponent({
        id: "test",
        count: "0",
        title: "Test",
      });

      const heading = screen.getByRole("heading", { name: "0" });

      expect(heading).toBeInTheDocument();
    });

    it("should handle zero-padded count", () => {
      renderComponent({
        id: "test",
        count: "05",
        title: "Test",
      });

      const heading = screen.getByRole("heading", { name: "05" });

      expect(heading).toBeInTheDocument();
    });

    it("should handle large count values", () => {
      renderComponent({
        id: "test",
        count: "999",
        title: "Test",
      });

      const heading = screen.getByRole("heading", { name: "999" });

      expect(heading).toBeInTheDocument();
    });

    it("should handle different title values", () => {
      const titles = ["Days", "Hours", "Mins", "Secs"];

      titles.forEach((title) => {
        document.body.innerHTML = "";
        renderComponent({
          id: "test",
          count: "0",
          title,
        });

        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty count", () => {
      const container = renderComponent({
        id: "test",
        count: "",
        title: "Test",
      });

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading).toHaveTextContent("");
    });

    it("should handle empty title", () => {
      const container = renderComponent({
        id: "test",
        count: "10",
        title: "",
      });

      const span = container.querySelector<HTMLSpanElement>("span");

      expect(span).toHaveTextContent("");
    });

    it("should handle special characters in count", () => {
      renderComponent({
        id: "test",
        count: "1+2",
        title: "Test",
      });

      const heading = screen.getByRole("heading", { name: "1+2" });

      expect(heading).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      renderComponent({
        id: "test",
        count: "10",
        title: "Test & More",
      });

      expect(screen.getByText("Test & More")).toBeInTheDocument();
    });
  });

  describe("Multiple Countdowns", () => {
    it("should render multiple countdowns independently", () => {
      renderComponent({
        id: "days",
        count: "5",
        title: "Days",
      });

      renderComponent({
        id: "hours",
        count: "12",
        title: "Hours",
      });

      expect(screen.getByRole("heading", { name: "5" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "12" })).toBeInTheDocument();
      expect(screen.getByText("Days")).toBeInTheDocument();
      expect(screen.getByText("Hours")).toBeInTheDocument();
    });

    it("should have unique ids for each countdown", () => {
      const countdown1 = renderComponent({
        id: "days",
        count: "5",
        title: "Days",
      });

      const countdown2 = renderComponent({
        id: "hours",
        count: "12",
        title: "Hours",
      });

      expect(countdown1.id).not.toBe(countdown2.id);
      expect(countdown1.id).toBe("days");
      expect(countdown2.id).toBe("hours");
    });

    it("should maintain separate content for each countdown", () => {
      const countdown1 = renderComponent({
        id: "mins",
        count: "30",
        title: "Mins",
      });

      const countdown2 = renderComponent({
        id: "secs",
        count: "45",
        title: "Secs",
      });

      expect(
        countdown1.querySelector<HTMLHeadingElement>("h4")
      ).toHaveTextContent("30");
      expect(
        countdown1.querySelector<HTMLSpanElement>("span")
      ).toHaveTextContent("Mins");

      expect(
        countdown2.querySelector<HTMLHeadingElement>("h4")
      ).toHaveTextContent("45");
      expect(
        countdown2.querySelector<HTMLSpanElement>("span")
      ).toHaveTextContent("Secs");
    });
  });

  describe("DOM Structure", () => {
    it("should have h4 element inside div", () => {
      const container = renderComponent({
        id: "test",
        count: "10",
        title: "Test",
      });

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading).toBeInTheDocument();
      expect(heading?.parentElement).toBe(container);
    });

    it("should have span element inside div", () => {
      const container = renderComponent({
        id: "test",
        count: "10",
        title: "Test",
      });

      const span = container.querySelector<HTMLSpanElement>("span");

      expect(span).toBeInTheDocument();
      expect(span?.parentElement).toBe(container);
    });

    it("should render h4 before span", () => {
      const container = renderComponent({
        id: "test",
        count: "10",
        title: "Test",
      });

      const children = Array.from(container.children);
      const h4Index = children.findIndex((child) => child.tagName === "H4");
      const spanIndex = children.findIndex((child) => child.tagName === "SPAN");

      expect(h4Index).toBeLessThan(spanIndex);
    });
  });
});
