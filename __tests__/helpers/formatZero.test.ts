import { formatZero } from "@/helpers/formatZero";

describe("formatZero", () => {
  describe("Single digit numbers", () => {
    it("should add leading zero for 0", () => {
      expect(formatZero(0)).toBe("00");
    });

    it("should add leading zero for 1", () => {
      expect(formatZero(1)).toBe("01");
    });

    it("should add leading zero for 5", () => {
      expect(formatZero(5)).toBe("05");
    });

    it("should add leading zero for 9", () => {
      expect(formatZero(9)).toBe("09");
    });

    it("should add leading zero for all single digits", () => {
      for (let i = 0; i < 10; i++) {
        expect(formatZero(i)).toBe(`0${i}`);
        expect(formatZero(i)).toHaveLength(2);
      }
    });
  });

  describe("Double digit numbers", () => {
    it("should not add leading zero for 10", () => {
      expect(formatZero(10)).toBe("10");
    });

    it("should not add leading zero for 15", () => {
      expect(formatZero(15)).toBe("15");
    });

    it("should not add leading zero for 23", () => {
      expect(formatZero(23)).toBe("23");
    });

    it("should not add leading zero for 59", () => {
      expect(formatZero(59)).toBe("59");
    });

    it("should not add leading zero for 99", () => {
      expect(formatZero(99)).toBe("99");
    });
  });

  describe("Large numbers", () => {
    it("should not add leading zero for 100", () => {
      expect(formatZero(100)).toBe("100");
    });

    it("should not add leading zero for 999", () => {
      expect(formatZero(999)).toBe("999");
    });

    it("should not add leading zero for 1000", () => {
      expect(formatZero(1000)).toBe("1000");
    });
  });

  describe("Edge cases", () => {
    it("should not format negative numbers (edge case)", () => {
      expect(formatZero(-5)).toBe("0-5");
      expect(formatZero(-15)).toBe("0-15");
      expect(formatZero(-10)).toBe("0-10");
    });
  });

  describe("Return type", () => {
    it("should return a string", () => {
      expect(typeof formatZero(5)).toBe("string");
      expect(typeof formatZero(15)).toBe("string");
    });

    it("should return string with length 2 for single digits", () => {
      expect(formatZero(5)).toHaveLength(2);
      expect(formatZero(0)).toHaveLength(2);
      expect(formatZero(9)).toHaveLength(2);
    });

    it("should return string matching input length for >= 10", () => {
      expect(formatZero(10)).toHaveLength(2);
      expect(formatZero(100)).toHaveLength(3);
      expect(formatZero(1000)).toHaveLength(4);
    });
  });

  describe("Common use cases", () => {
    it("should format hours correctly", () => {
      expect(formatZero(0)).toBe("00");
      expect(formatZero(9)).toBe("09");
      expect(formatZero(12)).toBe("12");
      expect(formatZero(23)).toBe("23");
    });

    it("should format minutes correctly", () => {
      expect(formatZero(0)).toBe("00");
      expect(formatZero(5)).toBe("05");
      expect(formatZero(30)).toBe("30");
      expect(formatZero(59)).toBe("59");
    });

    it("should format seconds correctly", () => {
      expect(formatZero(0)).toBe("00");
      expect(formatZero(1)).toBe("01");
      expect(formatZero(45)).toBe("45");
      expect(formatZero(59)).toBe("59");
    });
  });
});
