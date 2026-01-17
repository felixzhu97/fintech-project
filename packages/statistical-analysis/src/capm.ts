/**
 * CAPM（资本资产定价模型）
 */

/**
 * 使用CAPM计算期望收益率
 * @param riskFreeRate 无风险利率（年化，小数形式）
 * @param marketReturn 市场期望收益率（年化，小数形式）
 * @param beta 股票的Beta值
 * @returns 期望收益率（年化，小数形式）
 */
export function calculateExpectedReturn(
  riskFreeRate: number,
  marketReturn: number,
  beta: number
): number {
  // CAPM公式：E(Ri) = Rf + βi * (E(Rm) - Rf)
  return riskFreeRate + beta * (marketReturn - riskFreeRate);
}

/**
 * 计算市场风险溢价（Market Risk Premium）
 * @param marketReturn 市场期望收益率（年化，小数形式）
 * @param riskFreeRate 无风险利率（年化，小数形式）
 * @returns 市场风险溢价（小数形式）
 */
export function calculateMarketRiskPremium(marketReturn: number, riskFreeRate: number): number {
  return marketReturn - riskFreeRate;
}

/**
 * 计算Beta值（使用历史数据）
 * @param stockReturns 股票收益率数组
 * @param marketReturns 市场收益率数组
 * @returns Beta值
 */
export function calculateBeta(stockReturns: number[], marketReturns: number[]): number {
  if (stockReturns.length !== marketReturns.length) {
    throw new Error('股票收益率和市场收益率数组长度必须一致');
  }
  if (stockReturns.length < 2) {
    throw new Error('至少需要2个数据点来计算Beta');
  }

  // Beta = Cov(股票, 市场) / Var(市场)
  const covariance = calculateCovariance(stockReturns, marketReturns);
  const marketVariance = calculateVariance(marketReturns);

  if (marketVariance === 0) {
    throw new Error('市场收益率方差为0，无法计算Beta');
  }

  return covariance / marketVariance;
}

/**
 * 计算Alpha值（超额收益）
 * @param actualReturn 实际收益率（年化，小数形式）
 * @param expectedReturn 期望收益率（年化，小数形式，基于CAPM）
 * @returns Alpha值（小数形式）
 */
export function calculateAlpha(actualReturn: number, expectedReturn: number): number {
  return actualReturn - expectedReturn;
}

/**
 * 计算特雷诺比率（Treynor Ratio）
 * @param portfolioReturn 投资组合收益率（年化，小数形式）
 * @param riskFreeRate 无风险利率（年化，小数形式）
 * @param beta Beta值
 * @returns 特雷诺比率
 */
export function calculateTreynorRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  beta: number
): number {
  if (beta === 0) {
    throw new Error('Beta不能为0');
  }
  return (portfolioReturn - riskFreeRate) / beta;
}

/**
 * 计算方差（辅助函数）
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) {
    throw new Error('数组不能为空');
  }
  if (values.length === 1) {
    return 0;
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);

  return variance;
}

/**
 * 计算协方差（辅助函数）
 */
function calculateCovariance(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('两个数组长度必须一致');
  }
  if (x.length === 0) {
    throw new Error('数组不能为空');
  }

  const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
  const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;

  let covariance = 0;
  for (let i = 0; i < x.length; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
  }

  return covariance / (x.length - 1);
}
