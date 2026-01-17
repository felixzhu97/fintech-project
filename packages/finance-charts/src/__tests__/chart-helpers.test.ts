import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getThemeColors,
  calculateMinMax,
  generateSamplePriceData,
  generateSampleTimeSeriesData,
  isMobile,
} from "../utils/chart-helpers";

describe("chart-helpers", () => {
  describe("getThemeColors()", () => {
    describe("when given light theme", () => {
      it("should return light theme colors", () => {
        // Given
        const theme = "light" as const;

        // When
        const result = getThemeColors(theme);

        // Then
        expect(result.background).toBe("#ffffff");
        expect(result.text).toBe("#111827");
        expect(result.grid).toBe("#e5e7eb");
      });

      it("should return light theme as default", () => {
        // When
        const result = getThemeColors();

        // Then
        expect(result.background).toBe("#ffffff");
        expect(result.text).toBe("#111827");
      });
    });

    describe("when given dark theme", () => {
      it("should return dark theme colors", () => {
        // Given
        const theme = "dark" as const;

        // When
        const result = getThemeColors(theme);

        // Then
        expect(result.background).toBe("#1a1a1a");
        expect(result.text).toBe("#ffffff");
        expect(result.grid).toBe("#2a2a2a");
      });
    });
  });

  describe("calculateMinMax()", () => {
    describe("when given valid inputs", () => {
      it("should calculate min and max with padding", () => {
        // Given
        const values = [10, 20, 30, 40, 50];

        // When
        const result = calculateMinMax(values);

        // Then
        expect(result.min).toBeLessThan(10);
        expect(result.max).toBeGreaterThan(50);
        expect(result.min).toBeGreaterThanOrEqual(0);
      });

      it("should handle single value", () => {
        // Given
        const values = [42];

        // When
        const result = calculateMinMax(values);

        // Then
        expect(result.min).toBeLessThanOrEqual(42);
        expect(result.max).toBeGreaterThanOrEqual(42);
      });

      it("should return zero values for empty array", () => {
        // Given
        const values: number[] = [];

        // When
        const result = calculateMinMax(values);

        // Then
        expect(result.min).toBe(0);
        expect(result.max).toBe(0);
      });

      it("should ensure min is not negative", () => {
        // Given
        const values = [-10, 0, 10];

        // When
        const result = calculateMinMax(values);

        // Then
        expect(result.min).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("generateSamplePriceData()", () => {
    describe("when given valid inputs", () => {
      it("should generate correct number of data points", () => {
        // Given
        const count = 10;

        // When
        const result = generateSamplePriceData(count);

        // Then
        expect(result).toHaveLength(10);
      });

      it("should generate data with all required fields", () => {
        // Given
        const count = 5;

        // When
        const result = generateSamplePriceData(count);

        // Then
        result.forEach((item) => {
          expect(item).toHaveProperty("time");
          expect(item).toHaveProperty("open");
          expect(item).toHaveProperty("high");
          expect(item).toHaveProperty("low");
          expect(item).toHaveProperty("close");
          expect(typeof item.time).toBe("number");
          expect(typeof item.open).toBe("number");
          expect(typeof item.high).toBe("number");
          expect(typeof item.low).toBe("number");
          expect(typeof item.close).toBe("number");
        });
      });

      it("should generate data with high >= low", () => {
        // Given
        const count = 10;

        // When
        const result = generateSamplePriceData(count);

        // Then
        result.forEach((item) => {
          expect(item.high).toBeGreaterThanOrEqual(item.low);
        });
      });

      it("should use custom base price", () => {
        // Given
        const count = 5;
        const basePrice = 200;

        // When
        const result = generateSamplePriceData(count, basePrice);

        // Then
        expect(result[0].open).toBe(basePrice);
      });
    });
  });

  describe("generateSampleTimeSeriesData()", () => {
    describe("when given valid inputs", () => {
      it("should generate correct number of data points", () => {
        // Given
        const count = 10;

        // When
        const result = generateSampleTimeSeriesData(count);

        // Then
        expect(result).toHaveLength(10);
      });

      it("should generate data with all required fields", () => {
        // Given
        const count = 5;

        // When
        const result = generateSampleTimeSeriesData(count);

        // Then
        result.forEach((item) => {
          expect(item).toHaveProperty("time");
          expect(item).toHaveProperty("value");
          expect(typeof item.time).toBe("number");
          expect(typeof item.value).toBe("number");
        });
      });

      it("should use custom base value", () => {
        // Given
        const count = 5;
        const baseValue = 150;

        // When
        const result = generateSampleTimeSeriesData(count, baseValue);

        // Then
        expect(result[0].value).toBeGreaterThanOrEqual(baseValue - 5);
        expect(result[0].value).toBeLessThanOrEqual(baseValue + 5);
      });
    });
  });

  describe("isMobile()", () => {
    describe("when window is undefined", () => {
      it("should return false", () => {
        // Given
        const originalWindow = global.window;
        // @ts-expect-error - testing undefined window
        delete global.window;

        // When
        const result = isMobile();

        // Then
        expect(result).toBe(false);

        // Cleanup
        global.window = originalWindow;
      });
    });

    describe("when window exists", () => {
      afterEach(() => {
        vi.unstubAllGlobals();
      });

      describe("when window width is less than 768", () => {
        it("should return true", () => {
          // Given
          vi.stubGlobal("window", {
            innerWidth: 500,
          });

          // When
          const result = isMobile();

          // Then
          expect(result).toBe(true);
        });
      });

      describe("when window width is greater than or equal to 768", () => {
        it("should return false", () => {
          // Given
          vi.stubGlobal("window", {
            innerWidth: 1024,
          });

          // When
          const result = isMobile();

          // Then
          expect(result).toBe(false);
        });
      });
    });
  });
});
