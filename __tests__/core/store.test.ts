import type { Listener } from "@/types/store";

import { Store } from "@/core/store";

interface TestState extends Record<string, unknown> {
  count: number;
  name: string;
}

class TestStore extends Store<TestState> {}

describe("Store", () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore({ count: 0, name: "test" });
  });

  describe("getState", () => {
    it("should return the initial state", () => {
      expect(store.getState()).toEqual({ count: 0, name: "test" });
    });

    it("should reflect state after updates", () => {
      store.setState({ count: 5 });
      expect(store.getState()).toEqual({ count: 5, name: "test" });
    });
  });

  describe("get", () => {
    it("should return the value for the given key", () => {
      expect(store.get("count")).toBe(0);
    });

    it("should return the updated value after setState", () => {
      store.setState({ count: 42 });
      expect(store.get("count")).toBe(42);
    });

    it("should return string values correctly", () => {
      expect(store.get("name")).toBe("test");
    });
  });

  describe("setState", () => {
    it("should merge partial state without overwriting unrelated keys", () => {
      store.setState({ count: 5 });
      expect(store.getState()).toEqual({ count: 5, name: "test" });
    });

    it("should overwrite existing values", () => {
      store.setState({ name: "updated" });
      expect(store.get("name")).toBe("updated");
    });

    it("should notify listeners when a key changes", () => {
      const mockListener: Listener<number> = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 1 });
      expect(mockListener).toHaveBeenCalledWith(1);
    });

    it("should not notify listeners when the value does not change", () => {
      const mockListener: Listener<number> = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 0 });
      expect(mockListener).not.toHaveBeenCalled();
    });

    it("should only notify listeners for changed keys", () => {
      const mockCountListener: Listener<number> = jest.fn();
      const mockNameListener: Listener<string> = jest.fn();
      store.subscribe("count", mockCountListener);
      store.subscribe("name", mockNameListener);
      store.setState({ count: 5 });
      expect(mockCountListener).toHaveBeenCalledWith(5);
      expect(mockNameListener).not.toHaveBeenCalled();
    });

    it("should notify multiple listeners for the same key", () => {
      const mockListener1: Listener<number> = jest.fn();
      const mockListener2: Listener<number> = jest.fn();
      store.subscribe("count", mockListener1);
      store.subscribe("count", mockListener2);
      store.setState({ count: 3 });
      expect(mockListener1).toHaveBeenCalledWith(3);
      expect(mockListener2).toHaveBeenCalledWith(3);
    });
  });

  describe("subscribe", () => {
    it("should call the listener when the subscribed key changes", () => {
      const mockListener: Listener<number> = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 10 });
      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(10);
    });

    it("should return an unsubscribe function that removes the listener", () => {
      const mockListener: Listener<number> = jest.fn();
      const unsubscribe = store.subscribe("count", mockListener);
      unsubscribe();
      store.setState({ count: 10 });
      expect(mockListener).not.toHaveBeenCalled();
    });

    it("should not affect other listeners when one unsubscribes", () => {
      const mockListener1: Listener<number> = jest.fn();
      const mockListener2: Listener<number> = jest.fn();
      const unsubscribe1 = store.subscribe("count", mockListener1);
      store.subscribe("count", mockListener2);
      unsubscribe1();
      store.setState({ count: 7 });
      expect(mockListener1).not.toHaveBeenCalled();
      expect(mockListener2).toHaveBeenCalledWith(7);
    });

    it("should handle multiple successive updates", () => {
      const mockListener: Listener<number> = jest.fn();
      store.subscribe("count", mockListener);
      store.setState({ count: 1 });
      store.setState({ count: 2 });
      store.setState({ count: 3 });
      expect(mockListener).toHaveBeenCalledTimes(3);
      expect(mockListener).toHaveBeenLastCalledWith(3);
    });
  });
});
