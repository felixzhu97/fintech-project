/**
 * 有效前沿计算
 */

import { WeightConstraints, normalizeWeights } from './constraints';

/**
 * 投资组合结果接口
 */
export interface PortfolioResult {
  weights: number[];
  expectedReturn: number;
  variance: number;
  volatility: number;
  sharpeRatio?: number;
}

/**
 * 计算投资组合的期望收益
 * @param returns 各资产的期望收益率数组
 * @param weights 权重数组
 * @returns 投资组合的期望收益
 */
export function calculatePortfolioExpectedReturn(
  returns: number[],
  weights: number[]
): number {
  if (returns.length !== weights.length) {
    throw new Error('收益率数组和权重数组长度必须一致');
  }
  return returns.reduce((sum, r, i) => sum + r * weights[i], 0);
}

/**
 * 计算投资组合的方差
 * @param covarianceMatrix 协方差矩阵（n×n）
 * @param weights 权重数组（n）
 * @returns 投资组合的方差
 */
export function calculatePortfolioVariance(
  covarianceMatrix: number[][],
  weights: number[]
): number {
  if (covarianceMatrix.length !== weights.length) {
    throw new Error('协方差矩阵维度与权重数组长度必须一致');
  }
  if (covarianceMatrix.some((row) => row.length !== weights.length)) {
    throw new Error('协方差矩阵必须是方阵');
  }

  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * covarianceMatrix[i][j];
    }
  }

  return variance;
}

/**
 * 计算有效前沿上的投资组合
 * 使用目标收益率方法：对于给定的目标收益率，找到最小方差的投资组合权重
 * @param returns 各资产的期望收益率数组
 * @param covarianceMatrix 协方差矩阵
 * @param targetReturn 目标收益率
 * @param constraints 权重约束（可选）
 * @returns 投资组合结果
 */
export function calculateEfficientPortfolio(
  returns: number[],
  covarianceMatrix: number[][],
  targetReturn: number,
  constraints?: WeightConstraints
): PortfolioResult {
  if (returns.length !== covarianceMatrix.length) {
    throw new Error('收益率数组长度与协方差矩阵维度必须一致');
  }

  const n = returns.length;

  // 简化方法：使用等权重作为起点，然后迭代优化
  // 这是一个简化实现，实际应用中应使用二次规划求解器
  let bestWeights = normalizeWeights(new Array(n).fill(1 / n));
  let bestVariance = calculatePortfolioVariance(covarianceMatrix, bestWeights);
  const iterations = 10000;
  const learningRate = 0.01;

  // 随机梯度下降方法寻找最优权重
  for (let iter = 0; iter < iterations; iter++) {
    // 随机扰动权重
    const perturbation = bestWeights.map(() => (Math.random() - 0.5) * learningRate);
    const candidateWeights = normalizeWeights(
      bestWeights.map((w, i) => w + perturbation[i])
    );

    // 检查约束
    if (constraints && !checkWeightConstraints(candidateWeights, constraints)) {
      continue;
    }

    const expectedReturn = calculatePortfolioExpectedReturn(returns, candidateWeights);
    const variance = calculatePortfolioVariance(covarianceMatrix, candidateWeights);

    // 如果更接近目标收益率且方差更小，则更新
    if (
      Math.abs(expectedReturn - targetReturn) <=
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
  const finalVariance = bestVariance;

  return {
    weights: bestWeights,
    expectedReturn: finalReturn,
    variance: finalVariance,
    volatility: Math.sqrt(finalVariance),
  };
}

/**
 * 计算有效前沿（一系列有效投资组合）
 * @param returns 各资产的期望收益率数组
 * @param covarianceMatrix 协方差矩阵
 * @param numPortfolios 有效前沿上的投资组合数量，默认20
 * @param constraints 权重约束（可选）
 * @returns 有效前沿上的投资组合数组
 */
export function calculateEfficientFrontier(
  returns: number[],
  covarianceMatrix: number[][],
  numPortfolios: number = 20,
  constraints?: WeightConstraints
): PortfolioResult[] {
  if (numPortfolios < 2) {
    throw new Error('投资组合数量必须至少为2');
  }

  const minReturn = Math.min(...returns);
  const maxReturn = Math.max(...returns);

  const portfolios: PortfolioResult[] = [];

  for (let i = 0; i < numPortfolios; i++) {
    const targetReturn = minReturn + ((maxReturn - minReturn) * i) / (numPortfolios - 1);
    const portfolio = calculateEfficientPortfolio(
      returns,
      covarianceMatrix,
      targetReturn,
      constraints
    );
    portfolios.push(portfolio);
  }

  return portfolios;
}

/**
 * 计算最小方差组合（Global Minimum Variance Portfolio）
 * @param covarianceMatrix 协方差矩阵
 * @param constraints 权重约束（可选）
 * @returns 最小方差投资组合结果
 */
export function calculateMinimumVariancePortfolio(
  covarianceMatrix: number[][],
  constraints?: WeightConstraints
): PortfolioResult {
  const n = covarianceMatrix.length;
  const returns = new Array(n).fill(0); // 最小方差组合不关注收益率

  // 从所有可能的等权重开始
  let bestWeights = normalizeWeights(new Array(n).fill(1 / n));
  let bestVariance = calculatePortfolioVariance(covarianceMatrix, bestWeights);
  const iterations = 10000;
  const learningRate = 0.01;

  // 随机搜索最小方差组合
  for (let iter = 0; iter < iterations; iter++) {
    const perturbation = bestWeights.map(() => (Math.random() - 0.5) * learningRate);
    const candidateWeights = normalizeWeights(
      bestWeights.map((w, i) => w + perturbation[i])
    );

    if (constraints && !checkWeightConstraints(candidateWeights, constraints)) {
      continue;
    }

    const variance = calculatePortfolioVariance(covarianceMatrix, candidateWeights);

    if (variance < bestVariance) {
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

// 导入约束检查函数
function checkWeightConstraints(
  weights: number[],
  constraints: WeightConstraints
): boolean {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.01) {
    return false;
  }

  if (constraints.longOnly) {
    if (weights.some((w) => w < 0)) {
      return false;
    }
  }

  if (constraints.minWeight !== undefined) {
    if (weights.some((w) => w < constraints.minWeight!)) {
      return false;
    }
  }

  if (constraints.maxWeight !== undefined) {
    if (weights.some((w) => w > constraints.maxWeight!)) {
      return false;
    }
  }

  return true;
}
