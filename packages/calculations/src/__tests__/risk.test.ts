import { describe, it, expect } from "@fintech/test-utils";
import {
  calculateVolatility,
  calculateAnnualizedVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateVaR,
  calculateCVaR,
} from "../risk";

describe("risk", () => {
  describe("calculateVolatility()", () => {
    describe("when given valid inputs", () => {
      it("should calculate volatility correctly", () => {
        // Given
        const returns = [0.01, 0.02, -0.01, 0.015, -0.005];

        // When
        const result = calculateVolatility(returns);

        // Then
        expect(result).toBeGreaterThan(0);
        // Mean: (0.01 + 0.02 - 0.01 + 0.015 - 0.005) / 5 = 0.006
        // Variance ≈ 0.0001675, StdDev ≈ 0.0129
        expect(result).toBeCloseTo(0.0129, 2);
      });

      it("should return zero for single return value", () => {
        // Given
        const returns = [0.05];

        // When
        const result = calculateVolatility(returns);

        // Then
        expect(result).toBe(0);
      });

      it("should handle constant returns", () => {
        // Given
        const returns = [0.01, 0.01, 0.01, 0.01];

        // When
        const result = calculateVolatility(returns);

        // Then
        expect(result).toBe(0);
      });
    });

    describe("when returns array is empty", () => {
      it("should throw an error", () => {
        // Given
        const returns: number[] = [];

        // When & Then
        expect(() => calculateVolatility(returns)).toThrow(
          "收益率数组不能为空"
        );
      });
    });
  });

  describe("calculateAnnualizedVolatility()", () => {
    describe("when given valid inputs", () => {
      it("should calculate annualized volatility from monthly returns", () => {
        // Given
        const monthlyReturns = [0.01, -0.02, 0.015, -0.01];
        const periods = 12;

        // When
        const result = calculateAnnualizedVolatility(monthlyReturns, periods);

        // Then
        expect(result).toBeGreaterThan(0);
        // Monthly volatility ≈ 0.0165, Annualized ≈ 0.0165 * sqrt(12) ≈ 0.0572
        expect(result).toBeCloseTo(0.0572, 3);
      });

      it("should calculate annualized volatility from daily returns", () => {
        // Given
        const dailyReturns = [0.001, -0.002, 0.0015];
        const periods = 252;

        // When
        const result = calculateAnnualizedVolatility(dailyReturns, periods);

        // Then
        expect(result).toBeGreaterThan(0);
      });
    });

    describe("when periods is invalid", () => {
      it("should throw an error when periods is zero", () => {
        // Given
        const returns = [0.01, 0.02];
        const periods = 0;

        // When & Then
        expect(() => calculateAnnualizedVolatility(returns, periods)).toThrow(
          "周期数必须大于0"
        );
      });
    });
  });

  describe("calculateSharpeRatio()", () => {
    describe("when given valid inputs", () => {
      it("should calculate Sharpe ratio correctly", () => {
        // Given
        const returns = [0.01, 0.02, -0.01, 0.015];
        const riskFreeRate = 0.03 / 252; // 日度无风险利率

        // When
        const result = calculateSharpeRatio(returns, riskFreeRate);

        // Then
        expect(result).toBeGreaterThan(0);
      });

      it("should calculate Sharpe ratio with zero risk-free rate", () => {
        // Given
        const returns = [0.01, 0.02, -0.01];

        // When
        const result = calculateSharpeRatio(returns, 0);

        // Then
        expect(result).toBeGreaterThan(0);
      });

      it("should return zero when volatility is zero", () => {
        // Given
        const returns = [0.01, 0.01, 0.01];

        // When
        const result = calculateSharpeRatio(returns, 0.02);

        // Then
        expect(result).toBe(0);
      });
    });

    describe("when returns array is empty", () => {
      it("should throw an error", () => {
        // Given
        const returns: number[] = [];

        // When & Then
        expect(() => calculateSharpeRatio(returns)).toThrow(
          "收益率数组不能为空"
        );
      });
    });
  });

  describe("calculateMaxDrawdown()", () => {
    describe("when given valid inputs", () => {
      it("should calculate max drawdown correctly", () => {
        // Given
        const prices = [100, 110, 105, 120, 100, 115];

        // When
        const result = calculateMaxDrawdown(prices);

        // Then
        // Max price: 120, Min after max: 100
        // Drawdown: (120 - 100) / 120 = 0.1667
        expect(result).toBeCloseTo(0.1667, 3);
      });

      it("should return zero when prices are always increasing", () => {
        // Given
        const prices = [100, 110, 120, 130];

        // When
        const result = calculateMaxDrawdown(prices);

        // Then
        expect(result).toBe(0);
      });

      it("should return zero for single price", () => {
        // Given
        const prices = [100];

        // When
        const result = calculateMaxDrawdown(prices);

        // Then
        expect(result).toBe(0);
      });

      it("should calculate max drawdown from peak", () => {
        // Given
        const prices = [100, 150, 140, 130, 145, 120];

        // When
        const result = calculateMaxDrawdown(prices);

        // Then
        // Peak: 150, Lowest after: 120
        // Drawdown: (150 - 120) / 150 = 0.2
        expect(result).toBeCloseTo(0.2, 2);
      });
    });

    describe("when prices array is empty", () => {
      it("should throw an error", () => {
        // Given
        const prices: number[] = [];

        // When & Then
        expect(() => calculateMaxDrawdown(prices)).toThrow(
          "价格数组不能为空"
        );
      });
    });
  });

  describe("calculateVaR()", () => {
    describe("when given valid inputs", () => {
      it("should calculate VaR at 95% confidence", () => {
        // Given
        const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05];
        const confidence = 0.95;

        // When
        const result = calculateVaR(returns, confidence);

        // Then
        // Sorted: [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05]
        // Index = floor((1-0.95) * 8) = floor(0.4) = 0
        // VaR = -(-0.05) = 0.05
        expect(result).toBeGreaterThan(0); // VaR is positive (loss)
        expect(result).toBeCloseTo(0.05, 2);
      });

      it("should calculate VaR at 99% confidence", () => {
        // Given
        const returns = [-0.1, -0.05, -0.03, 0.01, 0.02, 0.03];
        const confidence = 0.99;

        // When
        const result = calculateVaR(returns, confidence);

        // Then
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });

    describe("when inputs are invalid", () => {
      it("should throw an error when returns array is empty", () => {
        // Given
        const returns: number[] = [];
        const confidence = 0.95;

        // When & Then
        expect(() => calculateVaR(returns, confidence)).toThrow(
          "收益率数组不能为空"
        );
      });

      it("should throw an error when confidence is out of range", () => {
        // Given
        const returns = [0.01, 0.02];
        const confidence = 1.5;

        // When & Then
        expect(() => calculateVaR(returns, confidence)).toThrow(
          "置信水平必须在 0 到 1 之间"
        );
      });

      it("should throw an error when confidence is zero or negative", () => {
        // Given
        const returns = [0.01, 0.02];
        const confidence = 0;

        // When & Then
        expect(() => calculateVaR(returns, confidence)).toThrow(
          "置信水平必须在 0 到 1 之间"
        );
      });
    });
  });

  describe("calculateCVaR()", () => {
    describe("when given valid inputs", () => {
      it("should calculate CVaR at 95% confidence", () => {
        // Given
        const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05];
        const confidence = 0.95;

        // When
        const result = calculateCVaR(returns, confidence);

        // Then
        // CVaR returns negative value (loss), so we check absolute value
        expect(Math.abs(result)).toBeGreaterThan(0); // CVaR represents loss
        // CVaR should be greater than or equal to VaR in absolute terms
        const varValue = calculateVaR(returns, confidence);
        expect(Math.abs(result)).toBeGreaterThanOrEqual(varValue);
      });
    });

    describe("when inputs are invalid", () => {
      it("should throw an error when returns array is empty", () => {
        // Given
        const returns: number[] = [];
        const confidence = 0.95;

        // When & Then
        expect(() => calculateCVaR(returns, confidence)).toThrow(
          "收益率数组不能为空"
        );
      });

      it("should throw an error when confidence is out of range", () => {
        // Given
        const returns = [0.01, 0.02];
        const confidence = -0.1;

        // When & Then
        expect(() => calculateCVaR(returns, confidence)).toThrow(
          "置信水平必须在 0 到 1 之间"
        );
      });
    });
  });
});
