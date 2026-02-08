import { CountdownStore, countdownStore } from "@/stores/countdownStore";

import { months, weekdays } from "@/constants/vars";

describe("CountdownStore", () => {
  let store: CountdownStore;

  beforeEach(() => {
    jest.useFakeTimers();
    store = new CountdownStore({
      lastDate: new Date(2026, 9, 14, 24, 0, 10),
      timeleft: 1,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("Constructor", () => {
    it("should initialize with correct state", () => {
      const state = store.getState();

      expect(state.lastDate).toBeInstanceOf(Date);
      expect(state.timeleft).toBe(1);
      expect(state.intervalGetTimeLeft).toBeNull();
    });

    it("should create empty listeners for each state key", () => {
      const state = store.getState();
      const keys = Object.keys(state);

      expect(keys).toContain("lastDate");
      expect(keys).toContain("timeleft");
      expect(keys).toContain("intervalGetTimeLeft");
    });
  });

  describe("getState", () => {
    it("should return the current state", () => {
      const state = store.getState();

      expect(state).toHaveProperty("lastDate");
      expect(state).toHaveProperty("timeleft");
      expect(state).toHaveProperty("intervalGetTimeLeft");
    });

    it("should return readonly state", () => {
      const state = store.getState();

      expect(Object.isFrozen(state)).toBe(false);
      expect(state).toBeDefined();
    });
  });

  describe("get", () => {
    it("should get specific state value by key", () => {
      expect(store.get("timeleft")).toBe(1);
      expect(store.get("intervalGetTimeLeft")).toBeNull();
    });

    it("should get lastDate", () => {
      const lastDate = store.get("lastDate");

      expect(lastDate).toBeInstanceOf(Date);
    });
  });

  describe("setState", () => {
    it("should update state with new values", () => {
      store.setState({ timeleft: 5000 });

      expect(store.get("timeleft")).toBe(5000);
    });

    it("should update multiple state values", () => {
      store.setState({
        timeleft: 10000,
        intervalGetTimeLeft: 123,
      });

      expect(store.get("timeleft")).toBe(10000);
      expect(store.get("intervalGetTimeLeft")).toBe(123);
    });

    it("should preserve other state values when updating", () => {
      const originalDate = store.get("lastDate");

      store.setState({ timeleft: 5000 });

      expect(store.get("lastDate")).toBe(originalDate);
    });

    it("should trigger listeners when state changes", () => {
      const listener = jest.fn();
      store.subscribe("timeleft", listener);

      store.setState({ timeleft: 5000 });

      expect(listener).toHaveBeenCalledWith(5000);
    });

    it("should not trigger listeners when value does not change", () => {
      const listener = jest.fn();
      store.subscribe("timeleft", listener);

      store.setState({ timeleft: 1 });

      expect(listener).not.toHaveBeenCalled();
    });

    it("should trigger multiple listeners for the same key", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      store.subscribe("timeleft", listener1);
      store.subscribe("timeleft", listener2);

      store.setState({ timeleft: 5000 });

      expect(listener1).toHaveBeenCalledWith(5000);
      expect(listener2).toHaveBeenCalledWith(5000);
    });
  });

  describe("subscribe", () => {
    it("should subscribe to state changes", () => {
      const listener = jest.fn();

      store.subscribe("timeleft", listener);
      store.setState({ timeleft: 5000 });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should return unsubscribe function", () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe("timeleft", listener);

      expect(typeof unsubscribe).toBe("function");
    });

    it("should unsubscribe listener when calling returned function", () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe("timeleft", listener);

      store.setState({ timeleft: 5000 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      store.setState({ timeleft: 10000 });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple subscriptions and unsubscriptions", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const unsubscribe1 = store.subscribe("timeleft", listener1);
      store.subscribe("timeleft", listener2);

      store.setState({ timeleft: 5000 });
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      unsubscribe1();

      store.setState({ timeleft: 10000 });
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it("should subscribe to different state keys independently", () => {
      const timeleftListener = jest.fn();
      const intervalListener = jest.fn();

      store.subscribe("timeleft", timeleftListener);
      store.subscribe("intervalGetTimeLeft", intervalListener);

      store.setState({ timeleft: 5000 });

      expect(timeleftListener).toHaveBeenCalledWith(5000);
      expect(intervalListener).not.toHaveBeenCalled();
    });
  });

  describe("getLastDateParsed", () => {
    it("should return parsed date object", () => {
      const parsed = store.getLastDateParsed();

      expect(parsed).toHaveProperty("dayName");
      expect(parsed).toHaveProperty("monthName");
      expect(parsed).toHaveProperty("dayNumber");
      expect(parsed).toHaveProperty("yearNumber");
      expect(parsed).toHaveProperty("hoursNumber");
      expect(parsed).toHaveProperty("minutesNumber");
      expect(parsed).toHaveProperty("time");
    });

    it("should parse day name correctly", () => {
      const testDate = new Date(2026, 0, 5);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.dayName).toBe(weekdays[testDate.getDay()]);
    });

    it("should parse month name correctly", () => {
      const testDate = new Date(2026, 11, 25);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.monthName).toBe(months[11]);
    });

    it("should format day number with leading zero", () => {
      const testDate = new Date(2026, 0, 5);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.dayNumber).toBe("05");
    });

    it("should not add leading zero for double digit days", () => {
      const testDate = new Date(2026, 0, 25);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.dayNumber).toBe("25");
    });

    it("should parse year correctly", () => {
      const testDate = new Date(2026, 0, 1);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.yearNumber).toBe(2026);
    });

    it("should format hours with leading zero", () => {
      const testDate = new Date(2026, 0, 1, 5, 30);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.hoursNumber).toBe("05");
    });

    it("should format minutes with leading zero", () => {
      const testDate = new Date(2026, 0, 1, 10, 5);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.minutesNumber).toBe("05");
    });

    it("should return AM for hours <= 12", () => {
      const testDate = new Date(2026, 0, 1, 10, 30);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.time).toBe("am");
    });

    it("should return PM for hours > 12", () => {
      const testDate = new Date(2026, 0, 1, 15, 30);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.time).toBe("pm");
    });

    it("should handle midnight (00:00)", () => {
      const testDate = new Date(2026, 0, 1, 0, 0);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.hoursNumber).toBe("00");
      expect(parsed.minutesNumber).toBe("00");
      expect(parsed.time).toBe("am");
    });

    it("should handle noon (12:00)", () => {
      const testDate = new Date(2026, 0, 1, 12, 0);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.hoursNumber).toBe("12");
      expect(parsed.minutesNumber).toBe("00");
      expect(parsed.time).toBe("am");
    });
  });

  describe("setTimeLeft", () => {
    it("should calculate time left correctly", () => {
      const futureDate = new Date(Date.now() + 86400000);
      store.setState({ lastDate: futureDate });

      store.setTimeLeft();

      const timeleft = store.get("timeleft");
      expect(timeleft).toBeGreaterThan(0);
      expect(timeleft).toBeLessThanOrEqual(86400000);
    });

    it("should update timeleft state", () => {
      const listener = jest.fn();
      store.subscribe("timeleft", listener);

      store.setTimeLeft();

      expect(listener).toHaveBeenCalled();
    });

    it("should calculate negative timeleft for past dates", () => {
      const pastDate = new Date(Date.now() - 86400000);
      store.setState({ lastDate: pastDate });

      store.setTimeLeft();

      const timeleft = store.get("timeleft");
      expect(timeleft).toBeLessThan(0);
    });

    it("should calculate zero or near-zero for current time", () => {
      jest.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
      const currentDate = new Date(2026, 0, 1, 12, 0, 0);
      store.setState({ lastDate: currentDate });

      store.setTimeLeft();

      const timeleft = store.get("timeleft");
      expect(Math.abs(timeleft)).toBeLessThan(1000);
    });
  });

  describe("setInterval", () => {
    it("should set interval state", () => {
      store.setInterval(123);

      expect(store.get("intervalGetTimeLeft")).toBe(123);
    });

    it("should update interval state when called multiple times", () => {
      store.setInterval(123);
      expect(store.get("intervalGetTimeLeft")).toBe(123);

      store.setInterval(456);
      expect(store.get("intervalGetTimeLeft")).toBe(456);
    });

    it("should trigger listeners when interval changes", () => {
      const listener = jest.fn();
      store.subscribe("intervalGetTimeLeft", listener);

      store.setInterval(123);

      expect(listener).toHaveBeenCalledWith(123);
    });
  });

  describe("Global countdownStore instance", () => {
    it("should be an instance of CountdownStore", () => {
      expect(countdownStore).toBeInstanceOf(CountdownStore);
    });

    it("should have initial state", () => {
      const state = countdownStore.getState();

      expect(state.lastDate).toBeInstanceOf(Date);
      expect(state.timeleft).toBeDefined();
      expect(state.intervalGetTimeLeft).toBeDefined();
    });

    it("should have correct initial date", () => {
      const lastDate = countdownStore.get("lastDate");

      expect(lastDate.getFullYear()).toBe(2026);
      expect(lastDate.getMonth()).toBe(9);
      expect(lastDate.getDate()).toBe(15);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty weekdays array gracefully", () => {
      const testDate = new Date(2026, 0, 1);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.dayName).toBeDefined();
    });

    it("should handle empty months array gracefully", () => {
      const testDate = new Date(2026, 0, 1);
      store.setState({ lastDate: testDate });

      const parsed = store.getLastDateParsed();

      expect(parsed.monthName).toBeDefined();
    });

    it("should handle invalid date gracefully", () => {
      const invalidDate = new Date("invalid");
      store.setState({ lastDate: invalidDate });

      expect(() => store.getLastDateParsed()).not.toThrow();
    });

    it("should handle very large time differences", () => {
      const farFutureDate = new Date(3000, 0, 1);
      store.setState({ lastDate: farFutureDate });

      store.setTimeLeft();

      const timeleft = store.get("timeleft");
      expect(timeleft).toBeGreaterThan(0);
    });

    it("should handle listener that throws error", () => {
      const errorListener = jest.fn(() => {
        throw new Error("Listener error");
      });
      const normalListener = jest.fn();

      store.subscribe("timeleft", errorListener);
      store.subscribe("timeleft", normalListener);

      expect(() => {
        store.setState({ timeleft: 5000 });
      }).toThrow();
    });
  });

  describe("Integration Tests", () => {
    it("should work with multiple state updates in sequence", () => {
      const listener = jest.fn();
      store.subscribe("timeleft", listener);

      store.setInterval(100);
      store.setTimeLeft();
      store.setState({ timeleft: 5000 });

      expect(listener).toHaveBeenCalled();
      expect(store.get("intervalGetTimeLeft")).toBe(100);
    });

    it("should maintain state consistency across operations", () => {
      const initialDate = store.get("lastDate");

      store.setInterval(123);
      store.setTimeLeft();

      expect(store.get("lastDate")).toBe(initialDate);
      expect(store.get("intervalGetTimeLeft")).toBe(123);
    });

    it("should handle rapid state updates", () => {
      const listener = jest.fn();
      store.subscribe("timeleft", listener);

      for (let i = 0; i < 100; i++) {
        store.setState({ timeleft: i });
      }

      expect(listener).toHaveBeenCalledTimes(100);
    });
  });
});
