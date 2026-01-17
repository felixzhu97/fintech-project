import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  formatDate,
  formatTimeForTradingView,
  generateGradientColors,
} from "../utils/data-formatters";

describe("data-formatters", () => {
  describe("formatCurrency()", () => {
    describe("when given valid inputs", () => {
      it("should format currency with default CNY", () => {
        // Given
        const value = 1234.56;

        // When
        const result = formatCurrency(value);

        // Then
        expect(result).toContain("¥");
        expect(result).toContain("1,234.56");
      });

      it("should format currency with custom currency", () => {
        // Given
        const value = 1234.56;
        const currency = "USD";

        // When
        const result = formatCurrency(value, currency);

        // Then
        expect(result).toContain("$");
        expect(result).toContain("1,234.56");
      });

      it("should format zero correctly", () => {
        // Given
        const value = 0;

        // When
        const result = formatCurrency(value);

        // Then
        expect(result).toContain("0.00");
      });

      it("should format negative values correctly", () => {
        // Given
        const value = -1234.56;

        // When
        const result = formatCurrency(value);

        // Then
        expect(result).toContain("-");
      });
    });
  });

  describe("formatPercent()", () => {
    describe("when given valid inputs", () => {
      it("should format percentage with default decimals", () => {
        // Given
        const value = 12.345;

        // When
        const result = formatPercent(value);

        // Then
        expect(result).toBe("12.35%");
      });

      it("should format percentage with custom decimals", () => {
        // Given
        const value = 12.345;
        const decimals = 1;

        // When
        const result = formatPercent(value, decimals);

        // Then
        expect(result).toBe("12.3%");
      });

      it("should format zero correctly", () => {
        // Given
        const value = 0;

        // When
        const result = formatPercent(value);

        // Then
        expect(result).toBe("0.00%");
      });
    });
  });

  describe("formatLargeNumber()", () => {
    describe("when given valid inputs", () => {
      it("should format numbers greater than 100 million as 亿", () => {
        // Given
        const value = 150000000;

        // When
        const result = formatLargeNumber(value);

        // Then
        expect(result).toBe("1.50亿");
      });

      it("should format numbers greater than 10 thousand as 万", () => {
        // Given
        const value = 15000;

        // When
        const result = formatLargeNumber(value);

        // Then
        expect(result).toBe("1.50万");
      });

      it("should format small numbers with locale string", () => {
        // Given
        const value = 1234;

        // When
        const result = formatLargeNumber(value);

        // Then
        expect(result).toBe("1,234");
      });

      it("should format zero correctly", () => {
        // Given
        const value = 0;

        // When
        const result = formatLargeNumber(value);

        // Then
        expect(result).toBe("0");
      });
    });
  });

  describe("formatDate()", () => {
    describe("when given valid inputs", () => {
      it("should format date with short format by default", () => {
        // Given
        const timestamp = "2024-01-15T10:30:00Z";

        // When
        const result = formatDate(timestamp);

        // Then
        expect(result).toContain("2024");
        expect(result).toContain("01");
        expect(result).toContain("15");
      });

      it("should format date with long format", () => {
        // Given
        const timestamp = "2024-01-15T10:30:00Z";

        // When
        const result = formatDate(timestamp, "long");

        // Then
        expect(result).toContain("2024");
        expect(result).toContain("01");
        expect(result).toContain("15");
        // Check that it contains time (hours and minutes)
        // Note: Timezone conversion may change the hour, so we just check format structure
        expect(result).toMatch(/\d{2}:\d{2}/); // Matches HH:MM format
        expect(result.length).toBeGreaterThan(10); // Long format should be longer than short format
      });

      it("should format number timestamp correctly", () => {
        // Given
        const timestamp = 1705314600; // Unix timestamp in seconds

        // When
        const result = formatDate(timestamp);

        // Then
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
      });
    });
  });

  describe("formatTimeForTradingView()", () => {
    describe("when given valid inputs", () => {
      it("should return Unix timestamp when given seconds timestamp", () => {
        // Given
        const timestamp = 1705314600;

        // When
        const result = formatTimeForTradingView(timestamp);

        // Then
        expect(result).toBe(1705314600);
      });

      it("should convert milliseconds timestamp to seconds", () => {
        // Given
        const timestamp = 1705314600000; // milliseconds

        // When
        const result = formatTimeForTradingView(timestamp);

        // Then
        expect(result).toBe(1705314600);
      });

      it("should convert string date to Unix timestamp", () => {
        // Given
        const timestamp = "2024-01-15T10:30:00Z";

        // When
        const result = formatTimeForTradingView(timestamp);

        // Then
        expect(result).toBeGreaterThan(0);
        expect(Number.isInteger(result)).toBe(true);
      });
    });
  });

  describe("generateGradientColors()", () => {
    describe("when given valid inputs", () => {
      it("should generate gradient colors with correct steps", () => {
        // Given
        const startColor = "#000000";
        const endColor = "#ffffff";
        const steps = 5;

        // When
        const result = generateGradientColors(startColor, endColor, steps);

        // Then
        expect(result).toHaveLength(5);
        expect(result[0]).toBe("#000000");
        expect(result[4]).toBe("#ffffff");
      });

      it("should generate two colors when steps is 2", () => {
        // Given
        const startColor = "#ff0000";
        const endColor = "#0000ff";
        const steps = 2;

        // When
        const result = generateGradientColors(startColor, endColor, steps);

        // Then
        expect(result).toHaveLength(2);
        expect(result[0]).toMatch(/^#[0-9a-f]{6}$/i);
        expect(result[1]).toMatch(/^#[0-9a-f]{6}$/i);
      });

      it("should handle invalid hex colors by returning original colors", () => {
        // Given
        const startColor = "invalid";
        const endColor = "invalid";
        const steps = 5;

        // When
        const result = generateGradientColors(startColor, endColor, steps);

        // Then
        expect(result).toEqual([startColor, endColor]);
      });
    });
  });
});
