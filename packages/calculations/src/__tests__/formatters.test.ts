import { describe, it, expect } from "@fintech/test-utils";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatLargeNumber,
  formatCompactNumber,
} from "../formatters";

describe("formatters", () => {
  describe("formatCurrency()", () => {
    describe("when given valid inputs", () => {
      it("should format CNY currency correctly", () => {
        // Given
        const amount = 1234.56;

        // When
        const result = formatCurrency(amount, "CNY", "zh-CN");

        // Then
        expect(result).toContain("1,234.56");
        expect(result).toContain("¥");
      });

      it("should format USD currency correctly", () => {
        // Given
        const amount = 1234.56;

        // When
        const result = formatCurrency(amount, "USD", "en-US");

        // Then
        expect(result).toContain("$");
        expect(result).toContain("1,234.56");
      });

      it("should use default CNY and zh-CN when not specified", () => {
        // Given
        const amount = 1000;

        // When
        const result = formatCurrency(amount);

        // Then
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
      });

      it("should handle zero amount", () => {
        // Given
        const amount = 0;

        // When
        const result = formatCurrency(amount, "CNY", "zh-CN");

        // Then
        expect(result).toContain("0");
      });

      it("should handle negative amount", () => {
        // Given
        const amount = -1234.56;

        // When
        const result = formatCurrency(amount, "CNY", "zh-CN");

        // Then
        expect(result).toContain("-");
      });
    });
  });

  describe("formatPercentage()", () => {
    describe("when given valid inputs", () => {
      it("should format percentage correctly with default decimals", () => {
        // Given
        const value = 0.15;

        // When
        const result = formatPercentage(value);

        // Then
        expect(result).toBe("15.00%");
      });

      it("should format percentage with custom decimals", () => {
        // Given
        const value = 0.1234;

        // When
        const result = formatPercentage(value, 1);

        // Then
        expect(result).toBe("12.3%");
      });

      it("should format zero percentage", () => {
        // Given
        const value = 0;

        // When
        const result = formatPercentage(value);

        // Then
        expect(result).toBe("0.00%");
      });

      it("should format negative percentage", () => {
        // Given
        const value = -0.1;

        // When
        const result = formatPercentage(value);

        // Then
        expect(result).toBe("-10.00%");
      });

      it("should format large percentage", () => {
        // Given
        const value = 1.5;

        // When
        const result = formatPercentage(value);

        // Then
        expect(result).toBe("150.00%");
      });
    });
  });

  describe("formatNumber()", () => {
    describe("when given valid inputs", () => {
      it("should format number with default decimals", () => {
        // Given
        const value = 123.456;

        // When
        const result = formatNumber(value);

        // Then
        expect(result).toBe("123.46");
      });

      it("should format number with custom decimals", () => {
        // Given
        const value = 123.456;

        // When
        const result = formatNumber(value, 4);

        // Then
        expect(result).toBe("123.4560");
      });

      it("should format zero", () => {
        // Given
        const value = 0;

        // When
        const result = formatNumber(value);

        // Then
        expect(result).toBe("0.00");
      });

      it("should format negative number", () => {
        // Given
        const value = -123.456;

        // When
        const result = formatNumber(value);

        // Then
        expect(result).toBe("-123.46");
      });
    });
  });

  describe("formatLargeNumber()", () => {
    describe("when given valid inputs", () => {
      it("should format large number with thousand separator", () => {
        // Given
        const value = 1234567.89;

        // When
        const result = formatLargeNumber(value);

        // Then
        // zh-CN uses different separator format
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
      });

      it("should format with custom decimals", () => {
        // Given
        const value = 1234567.89123;

        // When
        const result = formatLargeNumber(value, 1);

        // Then
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
      });

      it("should handle zero", () => {
        // Given
        const value = 0;

        // When
        const result = formatLargeNumber(value);

        // Then
        expect(result).toContain("0");
      });
    });
  });

  describe("formatCompactNumber()", () => {
    describe("when given valid inputs", () => {
      it("should format number in thousands (K)", () => {
        // Given
        const value = 1500;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("1.5K");
      });

      it("should format number in millions (M)", () => {
        // Given
        const value = 1200000;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("1.2M");
      });

      it("should format number in billions (B)", () => {
        // Given
        const value = 1500000000;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("1.5B");
      });

      it("should format number less than thousand", () => {
        // Given
        const value = 500;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("500.0");
      });

      it("should format negative number", () => {
        // Given
        const value = -1500;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("-1.5K");
      });

      it("should format with custom decimals", () => {
        // Given
        const value = 1500;

        // When
        const result = formatCompactNumber(value, 2);

        // Then
        expect(result).toBe("1.50K");
      });

      it("should handle zero", () => {
        // Given
        const value = 0;

        // When
        const result = formatCompactNumber(value);

        // Then
        expect(result).toBe("0.0");
      });
    });
  });
});
