import { describe, it, expect } from "vitest";
import {
  calculateReturn,
  calculateAnnualizedReturn,
  calculateCumulativeReturn,
} from "../returns";

describe("returns", () => {
  describe("calculateReturn()", () => {
    describe("when given valid inputs", () => {
      it("should calculate simple return correctly", () => {
        // Given
        const initial = 1000;
        const final = 1100;

        // When
        const result = calculateReturn(initial, final);

        // Then
        expect(result).toBe(0.1);
      });

      it("should calculate negative return correctly", () => {
        // Given
        const initial = 1000;
        const final = 900;

        // When
        const result = calculateReturn(initial, final);

        // Then
        expect(result).toBe(-0.1);
      });

      it("should calculate zero return correctly", () => {
        // Given
        const initial = 1000;
        const final = 1000;

        // When
        const result = calculateReturn(initial, final);

        // Then
        expect(result).toBe(0);
      });
    });

    describe("when initial value is zero", () => {
      it("should throw an error", () => {
        // Given
        const initial = 0;
        const final = 1000;

        // When & Then
        expect(() => calculateReturn(initial, final)).toThrow(
          "初始价值不能为0"
        );
      });
    });
  });

  describe("calculateAnnualizedReturn()", () => {
    describe("when given valid inputs", () => {
      it("should calculate annualized return from monthly returns", () => {
        // Given
        const monthlyReturns = [0.01, 0.02, -0.01, 0.015];
        const periods = 12; // 月度数据年化

        // When
        const result = calculateAnnualizedReturn(monthlyReturns, periods);

        // Then
        // Mean return: (0.01 + 0.02 - 0.01 + 0.015) / 4 = 0.00875
        // Annualized: (1 + 0.00875)^12 - 1 ≈ 0.1102
        expect(result).toBeGreaterThan(0);
        expect(result).toBeCloseTo(0.1102, 3);
      });

      it("should calculate annualized return from daily returns", () => {
        // Given
        const dailyReturns = [0.001, 0.002, -0.001];
        const periods = 252; // 日度数据年化

        // When
        const result = calculateAnnualizedReturn(dailyReturns, periods);

        // Then
        // Mean return: (0.001 + 0.002 - 0.001) / 3 = 0.000667
        // Annualized: (1 + 0.000667)^252 - 1 ≈ 0.1829
        expect(result).toBeGreaterThan(0);
        expect(result).toBeCloseTo(0.1829, 3);
      });
    });

    describe("when returns array is empty", () => {
      it("should throw an error", () => {
        // Given
        const returns: number[] = [];
        const periods = 12;

        // When & Then
        expect(() => calculateAnnualizedReturn(returns, periods)).toThrow(
          "收益率数组不能为空"
        );
      });
    });

    describe("when periods is invalid", () => {
      it("should throw an error when periods is zero", () => {
        // Given
        const returns = [0.01, 0.02];
        const periods = 0;

        // When & Then
        expect(() => calculateAnnualizedReturn(returns, periods)).toThrow(
          "周期数必须大于0"
        );
      });

      it("should throw an error when periods is negative", () => {
        // Given
        const returns = [0.01, 0.02];
        const periods = -1;

        // When & Then
        expect(() => calculateAnnualizedReturn(returns, periods)).toThrow(
          "周期数必须大于0"
        );
      });
    });
  });

  describe("calculateCumulativeReturn()", () => {
    describe("when given valid inputs", () => {
      it("should calculate cumulative return correctly", () => {
        // Given
        const returns = [0.1, 0.2, -0.05];

        // When
        const result = calculateCumulativeReturn(returns);

        // Then
        // (1.1 * 1.2 * 0.95) - 1 = 1.254 - 1 = 0.254
        expect(result).toBeCloseTo(0.254, 3);
      });

      it("should return zero for empty array", () => {
        // Given
        const returns: number[] = [];

        // When
        const result = calculateCumulativeReturn(returns);

        // Then
        expect(result).toBe(0);
      });

      it("should handle single return value", () => {
        // Given
        const returns = [0.15];

        // When
        const result = calculateCumulativeReturn(returns);

        // Then
        expect(result).toBeCloseTo(0.15, 10);
      });

      it("should handle negative cumulative return", () => {
        // Given
        const returns = [-0.1, -0.2];

        // When
        const result = calculateCumulativeReturn(returns);

        // Then
        // (0.9 * 0.8) - 1 = 0.72 - 1 = -0.28
        expect(result).toBeCloseTo(-0.28, 3);
      });
    });
  });
});
