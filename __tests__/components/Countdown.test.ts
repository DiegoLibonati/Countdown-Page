import { screen } from "@testing-library/dom";

import type { CountdownProps } from "@/types/props";
import type { CountdownComponent } from "@/types/components";

import { Countdown } from "@/components/Countdown/Countdown";

const renderComponent = (props: CountdownProps): CountdownComponent => {
  const container = Countdown(props);
  document.body.appendChild(container);
  return container;
};

describe("Countdown Component", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const defaultProps: CountdownProps = {
    id: "test-countdown",
    count: "05",
    title: "Days",
  };

  it("should render countdown with correct structure", () => {
    renderComponent(defaultProps);

    const countdown = document.querySelector<HTMLDivElement>("#test-countdown");
    expect(countdown).toBeInTheDocument();
  });

  it("should display count and title", () => {
    renderComponent(defaultProps);

    expect(screen.getByText("05")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
  });

  it("should render with different values", () => {
    const propsWithDifferentValues: CountdownProps = {
      id: "hours-countdown",
      count: "12",
      title: "Hours",
    };

    renderComponent(propsWithDifferentValues);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
  });
});
