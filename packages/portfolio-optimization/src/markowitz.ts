/**
 * 马科维茨优化模型
 */

import {
  WeightConstraints,
  normalizeWeights,
  checkWeightConstraints,
} from './constraints';
import {
  calculatePortfolioExpectedReturn,
  calculatePortfolioVariance,
  PortfolioResult,
} from './efficient-frontier';

/**
 * 马科维茨优化参数
 */
export interface MarkowitzOptimizationParams {
  returns: number[]; // 各资产的期望收益率
  covarianceMatrix: number[][]; // 协方差矩阵
  riskFreeRate?: number; // 无风险利率
  constraints?: WeightConstraints; // 权重约束
}

/**
 * 计算最大夏普比率组合（Tangent Portfolio）
 * @param params 马科维茨优化参数
 * @returns 最大夏普比率投资组合结果
 */
export function calculateMaxSharpePortfolio(
  params: MarkowitzOptimizationParams
): PortfolioResult {
  const { returns, covarianceMatrix, riskFreeRate = 0, constraints } = params;

  if (returns.length !== covarianceMatrix.length) {
    throw new Error('收益率数组长度与协方差矩阵维度必须一致');
  }

  const n = returns.length;

  // 计算超额收益（相对于无风险利率）
  const excessReturns = returns.map((r) => r - riskFreeRate);

  let bestWeights = normalizeWeights(new Array(n).fill(1 / n));
  let bestSharpe = calculateSharpeRatio(
    returns,
    covarianceMatrix,
    bestWeights,
    riskFreeRate
  );

  const iterations = 10000;
  const learningRate = 0.01;

  // 使用随机梯度下降方法寻找最大夏普比率
  for (let iter = 0; iter < iterations; iter++) {
    const perturbation = bestWeights.map(() => (Math.random() - 0.5) * learningRate);
    const candidateWeights = normalizeWeights(
      bestWeights.map((w, i) => w + perturbation[i])
    );

    if (constraints && !checkWeightConstraints(candidateWeights, constraints)) {
      continue;
    }

    const sharpe = calculateSharpeRatio(
      returns,
      covarianceMatrix,
      candidateWeights,
      riskFreeRate
    );

    if (sharpe > bestSharpe) {
      bestWeights = candidateWeights;
      bestSharpe = sharpe;
    }
  }

  const expectedReturn = calculatePortfolioExpectedReturn(returns, bestWeights);
  const variance = calculatePortfolioVariance(covarianceMatrix, bestWeights);

  return {
    weights: bestWeights,
    expectedReturn,
    variance,
    volatility: Math.sqrt(variance),
    sharpeRatio: bestSharpe,
  };
}

/**
 * 计算投资组合的夏普比率
 * @param returns 各资产的期望收益率数组
 * @param covarianceMatrix 协方差矩阵
 * @param weights 权重数组
 * @param riskFreeRate 无风险利率，默认0
 * @returns 夏普比率
 */
export function calculateSharpeRatio(
  returns: number[],
  covarianceMatrix: number[][],
  weights: number[],
  riskFreeRate: number = 0
): number {
  const portfolioReturn = calculatePortfolioExpectedReturn(returns, weights);
  const portfolioVariance = calculatePortfolioVariance(covarianceMatrix, weights);
  const portfolioVolatility = Math.sqrt(portfolioVariance);

  if (portfolioVolatility === 0) {
    return 0;
  }

  return (portfolioReturn - riskFreeRate) / portfolioVolatility;
}

/**
 * 马科维茨均值-方差优化
 * 在给定风险水平下最大化收益，或在给定收益水平下最小化风险
 * @param params 马科维茨优化参数
 * @param targetReturn 目标收益率（可选，如果提供则在给定收益下最小化风险）
 * @param targetRisk 目标风险（可选，如果提供则在给定风险下最大化收益）
 * @returns 优化后的投资组合结果
 */
export function optimizePortfolio(
  params: MarkowitzOptimizationParams,
  targetReturn?: number,
  targetRisk?: number
): PortfolioResult {
  const { returns, covarianceMatrix, constraints } = params;

  if (targetReturn !== undefined && targetRisk !== undefined) {
    throw new Error('不能同时指定目标收益率和目标风险');
  }

  if (targetReturn !== undefined) {
    // 在给定收益下最小化风险
    return optimizeForTargetReturn(params, targetReturn);
  } else if (targetRisk !== undefined) {
    // 在给定风险下最大化收益
    return optimizeForTargetRisk(params, targetRisk);
  } else {
    // 默认：最大化夏普比率
    return calculateMaxSharpePortfolio(params);
  }
}

/**
 * 在给定目标收益率下最小化风险
 */
function optimizeForTargetReturn(
  params: MarkowitzOptimizationParams,
  targetReturn: number
): PortfolioResult {
  const { returns, covarianceMatrix, constraints } = params;
  const n = returns.length;

  let bestWeights = normalizeWeights(new Array(n).fill(1 / n));
  let bestVariance = calculatePortfolioVariance(covarianceMatrix, bestWeights);
  const iterations = 10000;
  const learningRate = 0.01;

  for (let iter = 0; iter < iterations; iter++) {
    const perturbation = bestWeights.map(() => (Math.random() - 0.5) * learningRate);
    const candidateWeights = normalizeWeights(
      bestWeights.map((w, i) => w + perturbation[i])
    );

    if (constraints && !checkWeightConstraints(candidateWeights, constraints)) {
      continue;
    }

    const expectedReturn = calculatePortfolioExpectedReturn(returns, candidateWeights);
    const variance = calculatePortfolioVariance(covarianceMatrix, candidateWeights);

    if (
      Math.abs(expectedReturn - targetReturn) <
        Math.abs(
          calculatePortfolioExpectedReturn(returns, bestWeights) - targetReturn
        ) &&
      variance < bestVariance
    ) {
      bestWeights = candidateWeights;
      bestVariance = variance;
    }
  }

  const finalReturn = calculatePortfolioExpectedReturn(returns, bestWeights);

  return {
    weights: bestWeights,
    expectedReturn: finalReturn,
    variance: bestVariance,
    volatility: Math.sqrt(bestVariance),
  };
}

/**
 * 在给定目标风险下最大化收益
 */
function optimizeForTargetRisk(
  params: MarkowitzOptimizationParams,
  targetRisk: number
): PortfolioResult {
  const { returns, covarianceMatrix, constraints } = params;
  const targetVariance = targetRisk * targetRisk;
  const n = returns.length;

  let bestWeights = normalizeWeights(new Array(n).fill(1 / n));
  let bestReturn = calculatePortfolioExpectedReturn(returns, bestWeights);
  const iterations = 10000;
  const learningRate = 0.01;

  for (let iter = 0; iter < iterations; iter++) {
    const perturbation = bestWeights.map(() => (Math.random() - 0.5) * learningRate);
    const candidateWeights = normalizeWeights(
      bestWeights.map((w, i) => w + perturbation[i])
    );

    if (constraints && !checkWeightConstraints(candidateWeights, constraints)) {
      continue;
    }

    const expectedReturn = calculatePortfolioExpectedReturn(returns, candidateWeights);
    const variance = calculatePortfolioVariance(covarianceMatrix, candidateWeights);

    if (
      Math.abs(variance - targetVariance) <
        Math.abs(calculatePortfolioVariance(covarianceMatrix, bestWeights) - targetVariance) &&
      expectedReturn > bestReturn
    ) {
      bestWeights = candidateWeights;
      bestReturn = expectedReturn;
    }
  }

  const finalVariance = calculatePortfolioVariance(covarianceMatrix, bestWeights);

  return {
    weights: bestWeights,
    expectedReturn: bestReturn,
    variance: finalVariance,
    volatility: Math.sqrt(finalVariance),
  };
}
