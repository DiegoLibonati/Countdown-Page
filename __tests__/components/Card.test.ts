import type { CardProps } from "@/types/props";
import type { CardComponent } from "@/types/components";

import { Card } from "@/components/Card/Card";

import { countdownStore } from "@/stores/countdownStore";

const renderComponent = (props: CardProps): CardComponent => {
  const container = Card(props);
  document.body.appendChild(container);
  return container;
};

describe("Card Component", () => {
  beforeEach(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    countdownStore.setState({
      lastDate: futureDate,
      timeleft: 432000000,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    countdownStore.cleanup();
  });

  const defaultProps: CardProps = {
    title: "TEST GIVEAWAY",
  };

  it("should render card with correct title", () => {
    renderComponent(defaultProps);

    expect(document.body.textContent).toContain("TEST GIVEAWAY");
  });

  it("should render countdown components when time is left", () => {
    renderComponent(defaultProps);

    const countdowns = document.querySelector<HTMLDivElement>("#countdowns");
    expect(countdowns).toBeInTheDocument();

    const days = document.querySelector<HTMLDivElement>("#days");
    const hours = document.querySelector<HTMLDivElement>("#hours");
    const mins = document.querySelector<HTMLDivElement>("#mins");
    const secs = document.querySelector<HTMLDivElement>("#secs");

    expect(days).toBeInTheDocument();
    expect(hours).toBeInTheDocument();
    expect(mins).toBeInTheDocument();
    expect(secs).toBeInTheDocument();
  });

  it("should show expired message when time is up", () => {
    countdownStore.setState({ timeleft: -1 });

    renderComponent(defaultProps);

    expect(document.body.textContent).toContain(
      "The time to claim the offer has expired"
    );
  });

  it("should render image with correct src", () => {
    renderComponent(defaultProps);

    const image = document.querySelector<HTMLImageElement>("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/cell.png");
    expect(image).toHaveAttribute("alt", "iphone");
  });

  it("should cleanup subscription on component cleanup", () => {
    const card = renderComponent(defaultProps);

    expect(card.cleanup).toBeDefined();
    card.cleanup?.();

    expect(card.cleanup).toBeDefined();
  });
});
