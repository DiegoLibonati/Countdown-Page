import { CountdownProps } from "@src/entities/props";

import { Countdown } from "@src/components/Countdown/Countdown";

type RenderComponent = {
  props: CountdownProps;
  container: HTMLDivElement;
};

const renderComponent = (
  id: string,
  count: number,
  title: string
): RenderComponent => {
  const props: CountdownProps = {
    id: id,
    count: String(count),
    title: title,
  };

  const container = Countdown({
    id: props.id,
    count: props.count,
    title: props.title,
  });

  document.body.appendChild(container);

  return {
    props: props,
    container: container,
  };
};

describe("Countdown.ts", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("General Tests.", () => {
    const props = {
      id: "test-countdown",
      count: 42,
      title: "Days Remaining",
    };

    test("It should create a div element with correct id", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.id).toBe(props.id);
    });

    test("It should have correct base styling classes", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      expect(container.className).toContain("flex");
      expect(container.className).toContain("items-center");
      expect(container.className).toContain("justify-center");
      expect(container.className).toContain("flex-col");
    });

    test("It should render count correctly", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading).toBeInTheDocument();
      expect(heading?.textContent?.trim()).toBe(props.count.toString());
    });

    test("It should render title correctly", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      const span = container.querySelector<HTMLSpanElement>("span");

      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe(props.title);
    });

    test("It should have correct styling for count heading", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading?.className).toContain("bg-primary");
      expect(heading?.className).toContain("bg-opacity-75");
      expect(heading?.className).toContain("rounded-lg");
      expect(heading?.className).toContain("text-white");
      expect(heading?.className).toContain("font-bold");
    });

    test("It should have correct styling for title span", () => {
      const { container } = renderComponent(props.id, props.count, props.title);

      const span = container.querySelector<HTMLSpanElement>("span");

      expect(span?.className).toContain("text-secondary");
    });
  });

  describe("Edge cases", () => {
    test("It should handle zero count", () => {
      const { container } = renderComponent("countdown-zero", 0, "Zero Days");

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading?.textContent?.trim()).toBe("0");
    });

    test("It should handle negative count", () => {
      const { container } = renderComponent(
        "countdown-negative",
        -5,
        "Past Due"
      );

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading?.textContent?.trim()).toBe("-5");
    });

    test("It should handle large numbers", () => {
      const { container } = renderComponent(
        "countdown-large",
        9999,
        "Many Days"
      );

      const heading = container.querySelector<HTMLHeadingElement>("h4");

      expect(heading?.textContent?.trim()).toBe("9999");
    });

    test("It should handle empty title", () => {
      const { container } = renderComponent("countdown-empty", 10, "");

      const span = container.querySelector<HTMLHeadingElement>("span");

      expect(span?.textContent).toBe("");
    });
  });
});
