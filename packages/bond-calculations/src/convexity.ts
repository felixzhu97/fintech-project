/**
 * 债券凸性计算
 */

/**
 * 计算债券凸性（Convexity）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率（每年付息次数，例如：2 表示半年付息一次）
 * @returns 凸性值
 */
export function calculateConvexity(
  faceValue: number,
  couponRate: number,
  yieldRate: number,
  yearsToMaturity: number,
  couponFrequency: number = 2
): number {
  if (faceValue <= 0 || yearsToMaturity <= 0 || couponFrequency <= 0) {
    throw new Error('参数必须大于0');
  }

  const couponPayment = (faceValue * couponRate) / couponFrequency;
  const periods = yearsToMaturity * couponFrequency;
  const periodicYield = yieldRate / couponFrequency;

  if (Math.abs(periodicYield) < 1e-10) {
    // 收益率接近0的特殊情况
    const totalPayments = periods * (periods + 1) / 2;
    return totalPayments / Math.pow(couponFrequency, 2);
  }

  let weightedSum = 0;
  let presentValueSum = 0;

  // 计算每期现金流的加权现值（权重为 t(t+1)）
  for (let i = 1; i <= periods; i++) {
    const cashFlow = i === periods ? faceValue + couponPayment : couponPayment;
    const presentValue = cashFlow / Math.pow(1 + periodicYield, i);
    const timeWeight = (i * (i + 1)) / Math.pow(couponFrequency, 2); // 转换为年²

    weightedSum += presentValue * timeWeight;
    presentValueSum += presentValue;
  }

  if (presentValueSum === 0) {
    throw new Error('债券现值为0，无法计算凸性');
  }

  // 凸性 = 加权现值之和 / (现值之和 * (1 + 每期收益率)²)
  return weightedSum / (presentValueSum * Math.pow(1 + periodicYield, 2));
}

/**
 * 使用数值方法计算有效凸性（Effective Convexity）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率
 * @param yieldChange 收益率变化量（用于计算凸性，默认0.01表示1%）
 * @returns 有效凸性值
 */
export function calculateEffectiveConvexity(
  faceValue: number,
  couponRate: number,
  yieldRate: number,
  yearsToMaturity: number,
  couponFrequency: number = 2,
  yieldChange: number = 0.01
): number {
  if (faceValue <= 0 || yearsToMaturity <= 0 || couponFrequency <= 0) {
    throw new Error('参数必须大于0');
  }

  // 计算当前价格
  const price0 = calculateBondPrice(faceValue, couponRate, yieldRate, yearsToMaturity, couponFrequency);

  // 计算收益率上升后的价格
  const priceUp = calculateBondPrice(
    faceValue,
    couponRate,
    yieldRate + yieldChange,
    yearsToMaturity,
    couponFrequency
  );

  // 计算收益率下降后的价格
  const priceDown = calculateBondPrice(
    faceValue,
    couponRate,
    yieldRate - yieldChange,
    yearsToMaturity,
    couponFrequency
  );

  // 有效凸性 = (价格上升 + 价格下降 - 2 * 当前价格) / (当前价格 * 收益率变化²)
  const convexity = (priceUp + priceDown - 2 * price0) / (price0 * Math.pow(yieldChange, 2));

  return convexity;
}

/**
 * 使用凸性估算价格变化
 * 价格变化 ≈ -修正久期 * 收益率变化 + 0.5 * 凸性 * (收益率变化)²
 * @param currentPrice 当前价格
 * @param modifiedDuration 修正久期
 * @param convexity 凸性值
 * @param yieldChange 收益率变化（小数形式）
 * @returns 价格变化百分比（小数形式）
 */
export function estimatePriceChange(
  currentPrice: number,
  modifiedDuration: number,
  convexity: number,
  yieldChange: number
): number {
  const durationEffect = -modifiedDuration * yieldChange;
  const convexityEffect = 0.5 * convexity * Math.pow(yieldChange, 2);
  return durationEffect + convexityEffect;
}

/**
 * 计算债券价格（辅助函数）
 */
function calculateBondPrice(
  faceValue: number,
  couponRate: number,
  yieldRate: number,
  yearsToMaturity: number,
  couponFrequency: number
): number {
  const couponPayment = (faceValue * couponRate) / couponFrequency;
  const periods = yearsToMaturity * couponFrequency;
  const periodicYield = yieldRate / couponFrequency;

  if (Math.abs(periodicYield) < 1e-10) {
    return faceValue + couponPayment * periods;
  }

  const pvCoupons = (couponPayment * (1 - Math.pow(1 + periodicYield, -periods))) / periodicYield;
  const pvFaceValue = faceValue / Math.pow(1 + periodicYield, periods);

  return pvCoupons + pvFaceValue;
}
