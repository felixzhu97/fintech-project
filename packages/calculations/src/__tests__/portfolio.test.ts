import { describe, it, expect } from "@fintech/test-utils";
import {
  calculatePortfolioValue,
  calculateWeight,
  calculatePortfolioReturn,
  calculateWeightedReturn,
  calculatePortfolioWeights,
  type Holding,
} from "../portfolio";

describe("portfolio", () => {
  describe("calculatePortfolioValue()", () => {
    describe("when given valid inputs", () => {
      it("should calculate portfolio value correctly", () => {
        // Given
        const holdings: Holding[] = [
          { price: 100, quantity: 10 },
          { price: 50, quantity: 20 },
        ];

        // When
        const result = calculatePortfolioValue(holdings);

        // Then
        // 100 * 10 + 50 * 20 = 1000 + 1000 = 2000
        expect(result).toBe(2000);
      });

      it("should handle single holding", () => {
        // Given
        const holdings: Holding[] = [{ price: 100, quantity: 5 }];

        // When
        const result = calculatePortfolioValue(holdings);

        // Then
        expect(result).toBe(500);
      });

      it("should return zero for empty holdings", () => {
        // Given
        const holdings: Holding[] = [];

        // When
        const result = calculatePortfolioValue(holdings);

        // Then
        expect(result).toBe(0);
      });

      it("should handle zero quantity", () => {
        // Given
        const holdings: Holding[] = [{ price: 100, quantity: 0 }];

        // When
        const result = calculatePortfolioValue(holdings);

        // Then
        expect(result).toBe(0);
      });
    });
  });

  describe("calculateWeight()", () => {
    describe("when given valid inputs", () => {
      it("should calculate weight correctly", () => {
        // Given
        const assetValue = 500;
        const portfolioValue = 2000;

        // When
        const result = calculateWeight(assetValue, portfolioValue);

        // Then
        expect(result).toBe(0.25);
      });

      it("should calculate weight for full portfolio", () => {
        // Given
        const assetValue = 1000;
        const portfolioValue = 1000;

        // When
        const result = calculateWeight(assetValue, portfolioValue);

        // Then
        expect(result).toBe(1);
      });

      it("should handle zero asset value", () => {
        // Given
        const assetValue = 0;
        const portfolioValue = 1000;

        // When
        const result = calculateWeight(assetValue, portfolioValue);

        // Then
        expect(result).toBe(0);
      });
    });

    describe("when portfolio value is zero", () => {
      it("should throw an error", () => {
        // Given
        const assetValue = 500;
        const portfolioValue = 0;

        // When & Then
        expect(() => calculateWeight(assetValue, portfolioValue)).toThrow(
          "投资组合总价值不能为0"
        );
      });
    });
  });

  describe("calculatePortfolioReturn()", () => {
    describe("when given valid inputs", () => {
      it("should calculate portfolio return correctly", () => {
        // Given
        const currentHoldings: Holding[] = [
          { price: 110, quantity: 10 },
          { price: 55, quantity: 20 },
        ];
        const previousHoldings: Holding[] = [
          { price: 100, quantity: 10 },
          { price: 50, quantity: 20 },
        ];

        // When
        const result = calculatePortfolioReturn(currentHoldings, previousHoldings);

        // Then
        // Current: 110*10 + 55*20 = 1100 + 1100 = 2200
        // Previous: 100*10 + 50*20 = 1000 + 1000 = 2000
        // Return: (2200 - 2000) / 2000 = 0.1
        expect(result).toBe(0.1);
      });

      it("should return zero when no previous holdings", () => {
        // Given
        const currentHoldings: Holding[] = [
          { price: 100, quantity: 10 },
        ];

        // When
        const result = calculatePortfolioReturn(currentHoldings);

        // Then
        expect(result).toBe(0);
      });

      it("should handle negative return", () => {
        // Given
        const currentHoldings: Holding[] = [
          { price: 90, quantity: 10 },
        ];
        const previousHoldings: Holding[] = [
          { price: 100, quantity: 10 },
        ];

        // When
        const result = calculatePortfolioReturn(currentHoldings, previousHoldings);

        // Then
        // Current: 900, Previous: 1000
        // Return: (900 - 1000) / 1000 = -0.1
        expect(result).toBe(-0.1);
      });
    });

    describe("when previous portfolio value is zero", () => {
      it("should throw an error", () => {
        // Given
        const currentHoldings: Holding[] = [
          { price: 100, quantity: 10 },
        ];
        const previousHoldings: Holding[] = [
          { price: 0, quantity: 10 },
        ];

        // When & Then
        expect(() =>
          calculatePortfolioReturn(currentHoldings, previousHoldings)
        ).toThrow("之前的投资组合价值不能为0");
      });
    });
  });

  describe("calculateWeightedReturn()", () => {
    describe("when given valid inputs", () => {
      it("should calculate weighted return correctly", () => {
        // Given
        const returns = [0.1, 0.2];
        const weights = [0.6, 0.4];

        // When
        const result = calculateWeightedReturn(returns, weights);

        // Then
        // 0.1 * 0.6 + 0.2 * 0.4 = 0.06 + 0.08 = 0.14
        expect(result).toBe(0.14);
      });

      it("should handle single asset", () => {
        // Given
        const returns = [0.15];
        const weights = [1.0];

        // When
        const result = calculateWeightedReturn(returns, weights);

        // Then
        expect(result).toBe(0.15);
      });

      it("should handle zero returns", () => {
        // Given
        const returns = [0, 0];
        const weights = [0.5, 0.5];

        // When
        const result = calculateWeightedReturn(returns, weights);

        // Then
        expect(result).toBe(0);
      });
    });

    describe("when inputs are invalid", () => {
      it("should throw an error when arrays length mismatch", () => {
        // Given
        const returns = [0.1, 0.2];
        const weights = [0.5];

        // When & Then
        expect(() => calculateWeightedReturn(returns, weights)).toThrow(
          "收益率数组和权重数组长度必须一致"
        );
      });

      it("should throw an error when arrays are empty", () => {
        // Given
        const returns: number[] = [];
        const weights: number[] = [];

        // When & Then
        expect(() => calculateWeightedReturn(returns, weights)).toThrow(
          "数组不能为空"
        );
      });

      it("should throw an error when weights sum is not 1", () => {
        // Given
        const returns = [0.1, 0.2];
        const weights = [0.5, 0.6]; // Sum = 1.1

        // When & Then
        expect(() => calculateWeightedReturn(returns, weights)).toThrow(
          "权重总和必须等于1"
        );
      });
    });
  });

  describe("calculatePortfolioWeights()", () => {
    describe("when given valid inputs", () => {
      it("should calculate portfolio weights correctly", () => {
        // Given
        const holdings: Holding[] = [
          { price: 100, quantity: 10 }, // Value: 1000
          { price: 50, quantity: 20 }, // Value: 1000
        ];

        // When
        const result = calculatePortfolioWeights(holdings);

        // Then
        // Total: 2000
        // Weights: [1000/2000, 1000/2000] = [0.5, 0.5]
        expect(result).toHaveLength(2);
        expect(result[0]).toBe(0.5);
        expect(result[1]).toBe(0.5);
      });

      it("should return zero weights when portfolio value is zero", () => {
        // Given
        const holdings: Holding[] = [
          { price: 0, quantity: 10 },
        ];

        // When
        const result = calculatePortfolioWeights(holdings);

        // Then
        expect(result).toEqual([0]);
      });

      it("should handle single holding", () => {
        // Given
        const holdings: Holding[] = [{ price: 100, quantity: 10 }];

        // When
        const result = calculatePortfolioWeights(holdings);

        // Then
        expect(result).toEqual([1]);
      });

      it("should return empty array for empty holdings", () => {
        // Given
        const holdings: Holding[] = [];

        // When
        const result = calculatePortfolioWeights(holdings);

        // Then
        expect(result).toEqual([]);
      });
    });
  });
});
