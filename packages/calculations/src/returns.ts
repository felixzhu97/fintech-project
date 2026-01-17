/**
 * 收益率计算工具函数
 */

/**
 * 计算简单收益率
 * @param initial 初始价值
 * @param final 最终价值
 * @returns 收益率（小数形式，例如 0.1 表示 10%）
 */
export function calculateReturn(initial: number, final: number): number {
  if (initial === 0) {
    throw new Error('初始价值不能为0');
  }
  return (final - initial) / initial;
}

/**
 * 计算年化收益率
 * @param returns 收益率数组（小数形式）
 * @param periods 年化周期数（例如：12 表示月度数据年化，252 表示日度数据年化）
 * @returns 年化收益率（小数形式）
 */
export function calculateAnnualizedReturn(
  returns: number[],
  periods: number
): number {
  if (returns.length === 0) {
    throw new Error('收益率数组不能为空');
  }
  if (periods <= 0) {
    throw new Error('周期数必须大于0');
  }

  // 计算平均收益率
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // 年化收益率 = (1 + 平均收益率)^周期数 - 1
  return Math.pow(1 + meanReturn, periods) - 1;
}

/**
 * 计算累计收益率
 * @param returns 收益率数组（小数形式）
 * @returns 累计收益率（小数形式）
 */
export function calculateCumulativeReturn(returns: number[]): number {
  if (returns.length === 0) {
    return 0;
  }

  // 累计收益率 = (1 + r1) * (1 + r2) * ... * (1 + rn) - 1
  const cumulative = returns.reduce(
    (product, r) => product * (1 + r),
    1
  );
  return cumulative - 1;
}
