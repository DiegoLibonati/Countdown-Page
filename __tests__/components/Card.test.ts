import { screen } from "@testing-library/dom";

import type { CardComponent } from "@/types/components";

import { Card } from "@/components/Card/Card";

import { countdownStore } from "@/stores/countdownStore";

import { mockAssets } from "@tests/__mocks__/assets.mock";

jest.mock("@/stores/countdownStore", () => ({
  countdownStore: {
    getLastDateParsed: jest.fn(),
    get: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.doMock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));

const renderComponent = (title: string): CardComponent => {
  const container = Card({ title });
  document.body.appendChild(container);
  return container;
};

describe("Card", () => {
  beforeEach(() => {
    (countdownStore.getLastDateParsed as jest.Mock).mockReturnValue({
      dayName: "Monday",
      dayNumber: 25,
      monthName: "December",
      yearNumber: 2024,
      hoursNumber: 10,
      minutesNumber: "30",
      time: "AM",
    });

    (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
      if (key === "timeleft") return 86400000;
      if (key === "intervalGetTimeLeft") return null;
      return null;
    });

    (countdownStore.subscribe as jest.Mock).mockReturnValue(jest.fn());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should create a div element", () => {
      const container = renderComponent("iPhone 14 Pro Giveaway");

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.tagName).toBe("DIV");
    });

    it("should have correct styling classes", () => {
      const container = renderComponent("Test Giveaway");

      expect(container).toHaveClass(
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "flex-col",
        "rounded-lg",
        "shadow-md"
      );
    });

    it("should render title correctly", () => {
      renderComponent("iPhone 14 Pro Giveaway");

      const heading = screen.getByRole("heading", {
        name: "iPhone 14 Pro Giveaway",
        level: 2,
      });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("text-base", "text-secondary");
    });

    it("should render date information correctly", () => {
      const container = renderComponent("Test Giveaway");

      const subheading = container.querySelector("h4");

      expect(subheading).toHaveTextContent(
        "Giveaway Ends On Monday, 25 December 2024 10:30AM"
      );
      expect(subheading).toHaveClass("text-sm", "text-secondary");
    });

    it("should render cell phone image with correct attributes", () => {
      renderComponent("Test Giveaway");

      const img = screen.getByRole("img", { name: "iphone" });

      expect(img).toHaveAttribute(
        "src",
        expect.stringContaining("mock-file-path")
      );
      expect(img).toHaveAttribute("alt", "iphone");
      expect(img).toHaveClass("absolute", "-top-24", "-right-6", "z-20");
    });

    it("should render countdowns container", () => {
      const container = renderComponent("Test Giveaway");

      const countdowns = container.querySelector("#countdowns");

      expect(countdowns).toBeInTheDocument();
      expect(countdowns).toHaveClass(
        "flex",
        "flex-row",
        "items-center",
        "justify-between",
        "w-full",
        "mt-2"
      );
    });

    it("should handle empty title", () => {
      renderComponent("");

      const heading = screen.getByRole("heading", { level: 2 });

      expect(heading).toHaveTextContent("");
    });
  });

  describe("Countdown Rendering", () => {
    it("should render 4 countdown components when time is left", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 90061000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const countdowns = container.querySelector("#countdowns");

      expect(countdowns?.children).toHaveLength(4);
      expect(container.querySelector("#days")).toBeInTheDocument();
      expect(container.querySelector("#hours")).toBeInTheDocument();
      expect(container.querySelector("#mins")).toBeInTheDocument();
      expect(container.querySelector("#secs")).toBeInTheDocument();
    });

    it("should calculate days correctly", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 172800000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const days = container.querySelector("#days h4");

      expect(days).toHaveTextContent("2");
    });

    it("should calculate hours correctly with zero padding", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 7200000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const hours = container.querySelector("#hours h4");

      expect(hours).toHaveTextContent("02");
    });

    it("should calculate minutes correctly with zero padding", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 300000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const mins = container.querySelector("#mins h4");

      expect(mins).toHaveTextContent("05");
    });

    it("should calculate seconds correctly with zero padding", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 9000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const secs = container.querySelector("#secs h4");

      expect(secs).toHaveTextContent("09");
    });

    it("should display countdown labels correctly", () => {
      renderComponent("Test Giveaway");

      expect(screen.getByText("Days")).toBeInTheDocument();
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByText("Mins")).toBeInTheDocument();
      expect(screen.getByText("Secs")).toBeInTheDocument();
    });
  });

  describe("Expired State", () => {
    it("should show expired message when timeleft is zero", () => {
      const mockInterval = 123;
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 0;
        if (key === "intervalGetTimeLeft") return mockInterval;
        return null;
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      const container = renderComponent("Test Giveaway");

      const countdowns = container.querySelector("#countdowns");

      expect(countdowns).toHaveTextContent(
        "The time to claim the offer has expired"
      );
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval);
    });

    it("should show expired message when timeleft is negative", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return -1000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const countdowns = container.querySelector("#countdowns");

      expect(countdowns).toHaveTextContent(
        "The time to claim the offer has expired"
      );
    });

    it("should not clear interval when intervalGetTimeLeft is null", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 0;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      renderComponent("Test Giveaway");

      expect(clearIntervalSpy).not.toHaveBeenCalled();
    });

    it("should clear countdowns before showing expired message", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 0;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      const countdowns = container.querySelector("#countdowns");
      const countdownComponents = countdowns?.querySelectorAll(
        "#days, #hours, #mins, #secs"
      );

      expect(countdownComponents).toHaveLength(0);
    });
  });

  describe("Store Subscription", () => {
    it("should subscribe to timeleft changes", () => {
      renderComponent("Test Giveaway");

      expect(countdownStore.subscribe).toHaveBeenCalledWith(
        "timeleft",
        expect.any(Function)
      );
    });

    it("should call renderCountdowns on subscription", () => {
      let subscriptionCallback: (() => void) | undefined;

      (countdownStore.subscribe as jest.Mock).mockImplementation(
        (_: string, callback: () => void) => {
          subscriptionCallback = callback;
          return jest.fn();
        }
      );

      const container = renderComponent("Test Giveaway");

      expect(container.querySelector("#countdowns")?.children).toHaveLength(4);

      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 0;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      subscriptionCallback?.();

      expect(container.querySelector("#countdowns")).toHaveTextContent(
        "The time to claim the offer has expired"
      );
    });
  });

  describe("Cleanup", () => {
    it("should have cleanup function", () => {
      const container = renderComponent("Test Giveaway");

      expect(typeof container.cleanup).toBe("function");
    });

    it("should unsubscribe on cleanup", () => {
      const unsubscribeMock = jest.fn();
      (countdownStore.subscribe as jest.Mock).mockReturnValue(unsubscribeMock);

      const container = renderComponent("Test Giveaway");

      container.cleanup?.();

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single digit minutes in date", () => {
      (countdownStore.getLastDateParsed as jest.Mock).mockReturnValue({
        dayName: "Monday",
        dayNumber: 25,
        monthName: "December",
        yearNumber: 2024,
        hoursNumber: 10,
        minutesNumber: "05",
        time: "AM",
      });

      const container = renderComponent("Test");

      const subheading = container.querySelector("h4");

      expect(subheading).toHaveTextContent("10:05AM");
    });

    it("should handle complex timeleft calculation", () => {
      (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "timeleft") return 90061000;
        if (key === "intervalGetTimeLeft") return null;
        return null;
      });

      const container = renderComponent("Test Giveaway");

      expect(container.querySelector("#days h4")).toHaveTextContent("1");
      expect(container.querySelector("#hours h4")).toHaveTextContent("01");
      expect(container.querySelector("#mins h4")).toHaveTextContent("01");
      expect(container.querySelector("#secs h4")).toHaveTextContent("01");
    });

    it("should replaceChildren before rendering new countdowns", () => {
      const container = renderComponent("Test Giveaway");
      const countdowns = container.querySelector("#countdowns");

      const replaceChildrenSpy = jest.spyOn(countdowns!, "replaceChildren");

      const subscriptionCallback = (countdownStore.subscribe as jest.Mock).mock
        .calls[0][1];
      subscriptionCallback();

      expect(replaceChildrenSpy).toHaveBeenCalled();
    });
  });
});
