/**
 * 投资组合计算工具函数
 */

/**
 * 持仓项接口
 */
export interface Holding {
  price: number;
  quantity: number;
}

/**
 * 计算投资组合总价值
 * @param holdings 持仓数组
 * @returns 投资组合总价值
 */
export function calculatePortfolioValue(holdings: Holding[]): number {
  return holdings.reduce(
    (total, holding) => total + holding.price * holding.quantity,
    0
  );
}

/**
 * 计算资产权重
 * @param assetValue 资产价值
 * @param portfolioValue 投资组合总价值
 * @returns 权重（小数形式，例如 0.25 表示 25%）
 */
export function calculateWeight(
  assetValue: number,
  portfolioValue: number
): number {
  if (portfolioValue === 0) {
    throw new Error('投资组合总价值不能为0');
  }
  return assetValue / portfolioValue;
}

/**
 * 计算投资组合收益率
 * @param holdings 当前持仓数组
 * @param previousHoldings 之前的持仓数组（可选）
 * @returns 收益率（小数形式）
 */
export function calculatePortfolioReturn(
  holdings: Holding[],
  previousHoldings?: Holding[]
): number {
  const currentValue = calculatePortfolioValue(holdings);

  if (!previousHoldings || previousHoldings.length === 0) {
    return 0;
  }

  const previousValue = calculatePortfolioValue(previousHoldings);

  if (previousValue === 0) {
    throw new Error('之前的投资组合价值不能为0');
  }

  return (currentValue - previousValue) / previousValue;
}

/**
 * 计算加权平均收益率
 * @param returns 各资产收益率数组（小数形式）
 * @param weights 各资产权重数组（小数形式，总和应为1）
 * @returns 加权平均收益率（小数形式）
 */
export function calculateWeightedReturn(
  returns: number[],
  weights: number[]
): number {
  if (returns.length !== weights.length) {
    throw new Error('收益率数组和权重数组长度必须一致');
  }
  if (returns.length === 0) {
    throw new Error('数组不能为空');
  }

  // 验证权重总和是否接近1（允许小的浮点误差）
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  if (Math.abs(weightSum - 1) > 0.01) {
    throw new Error('权重总和必须等于1');
  }

  return returns.reduce((sum, r, i) => sum + r * weights[i], 0);
}

/**
 * 计算投资组合中各资产的权重
 * @param holdings 持仓数组
 * @returns 权重数组（与持仓数组顺序对应）
 */
export function calculatePortfolioWeights(holdings: Holding[]): number[] {
  const totalValue = calculatePortfolioValue(holdings);

  if (totalValue === 0) {
    return holdings.map(() => 0);
  }

  return holdings.map((holding) => {
    const assetValue = holding.price * holding.quantity;
    return calculateWeight(assetValue, totalValue);
  });
}
