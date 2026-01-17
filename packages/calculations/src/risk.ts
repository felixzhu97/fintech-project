/**
 * 风险评估指标计算工具函数
 */

/**
 * 计算波动率（标准差）
 * @param returns 收益率数组（小数形式）
 * @returns 波动率（小数形式）
 */
export function calculateVolatility(returns: number[]): number {
  if (returns.length === 0) {
    throw new Error('收益率数组不能为空');
  }
  if (returns.length === 1) {
    return 0;
  }

  // 计算平均收益率
  const meanReturn =
    returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // 计算方差
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
    (returns.length - 1);

  // 标准差（波动率）
  return Math.sqrt(variance);
}

/**
 * 计算年化波动率
 * @param returns 收益率数组（小数形式）
 * @param periods 年化周期数（例如：12 表示月度数据年化，252 表示日度数据年化）
 * @returns 年化波动率（小数形式）
 */
export function calculateAnnualizedVolatility(
  returns: number[],
  periods: number
): number {
  if (periods <= 0) {
    throw new Error('周期数必须大于0');
  }
  const volatility = calculateVolatility(returns);
  return volatility * Math.sqrt(periods);
}

/**
 * 计算夏普比率
 * @param returns 收益率数组（小数形式）
 * @param riskFreeRate 无风险利率（小数形式，例如 0.03 表示 3%）
 * @returns 夏普比率
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0
): number {
  if (returns.length === 0) {
    throw new Error('收益率数组不能为空');
  }

  // 计算平均收益率
  const meanReturn =
    returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // 计算波动率
  const volatility = calculateVolatility(returns);

  if (volatility === 0) {
    return 0; // 如果没有波动，夏普比率视为0
  }

  // 夏普比率 = (平均收益率 - 无风险利率) / 波动率
  return (meanReturn - riskFreeRate) / volatility;
}

/**
 * 计算最大回撤
 * @param prices 价格数组（按时间顺序）
 * @returns 最大回撤（小数形式，例如 0.15 表示 15%）
 */
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (prices.length === 1) {
    return 0;
  }

  let maxPrice = prices[0];
  let maxDrawdown = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i];
    }

    const drawdown = (maxPrice - prices[i]) / maxPrice;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

/**
 * 计算风险价值 (Value at Risk, VaR)
 * @param returns 收益率数组（小数形式）
 * @param confidence 置信水平（小数形式，例如 0.95 表示 95%）
 * @returns VaR 值（小数形式，负数表示损失）
 */
export function calculateVaR(returns: number[], confidence: number): number {
  if (returns.length === 0) {
    throw new Error('收益率数组不能为空');
  }
  if (confidence <= 0 || confidence >= 1) {
    throw new Error('置信水平必须在 0 到 1 之间');
  }

  // 对收益率排序
  const sortedReturns = [...returns].sort((a, b) => a - b);

  // 计算分位数索引
  const index = Math.floor((1 - confidence) * sortedReturns.length);

  // VaR 是负的分位数（因为关注的是损失）
  return -sortedReturns[index] || 0;
}

/**
 * 计算条件风险价值 (Conditional VaR, CVaR)
 * 也称为 Expected Shortfall
 * @param returns 收益率数组（小数形式）
 * @param confidence 置信水平（小数形式，例如 0.95 表示 95%）
 * @returns CVaR 值（小数形式，负数表示损失）
 */
export function calculateCVaR(returns: number[], confidence: number): number {
  if (returns.length === 0) {
    throw new Error('收益率数组不能为空');
  }
  if (confidence <= 0 || confidence >= 1) {
    throw new Error('置信水平必须在 0 到 1 之间');
  }

  // 对收益率排序
  const sortedReturns = [...returns].sort((a, b) => a - b);

  // 计算 VaR 阈值
  const thresholdIndex = Math.floor((1 - confidence) * sortedReturns.length);
  const varValue = -sortedReturns[thresholdIndex] || 0;

  // 计算超过 VaR 的平均损失
  const tailReturns = sortedReturns
    .slice(0, thresholdIndex + 1)
    .filter((r) => -r >= varValue);

  if (tailReturns.length === 0) {
    return varValue;
  }

  const avgTailLoss =
    tailReturns.reduce((sum, r) => sum + Math.abs(r), 0) /
    tailReturns.length;

  return -avgTailLoss;
}
