/**
 * 债券久期计算
 */

/**
 * 计算麦考利久期（Macaulay Duration）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率（每年付息次数，例如：2 表示半年付息一次）
 * @returns 麦考利久期（年）
 */
export function calculateMacaulayDuration(
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
    return (periods + 1) / (2 * couponFrequency);
  }

  let weightedSum = 0;
  let presentValueSum = 0;

  // 计算每期现金流的加权现值
  for (let i = 1; i <= periods; i++) {
    const cashFlow = i === periods ? faceValue + couponPayment : couponPayment;
    const presentValue = cashFlow / Math.pow(1 + periodicYield, i);
    const weight = i / couponFrequency; // 转换为年

    weightedSum += presentValue * weight;
    presentValueSum += presentValue;
  }

  if (presentValueSum === 0) {
    throw new Error('债券现值为0，无法计算久期');
  }

  return weightedSum / presentValueSum;
}

/**
 * 计算修正久期（Modified Duration）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率（每年付息次数）
 * @returns 修正久期（年）
 */
export function calculateModifiedDuration(
  faceValue: number,
  couponRate: number,
  yieldRate: number,
  yearsToMaturity: number,
  couponFrequency: number = 2
): number {
  const macaulayDuration = calculateMacaulayDuration(
    faceValue,
    couponRate,
    yieldRate,
    yearsToMaturity,
    couponFrequency
  );
  const periodicYield = yieldRate / couponFrequency;

  // 修正久期 = 麦考利久期 / (1 + 每期收益率)
  return macaulayDuration / (1 + periodicYield);
}

/**
 * 计算有效久期（Effective Duration）
 * 使用数值方法计算，通过价格变化估算久期
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率
 * @param yieldChange 收益率变化量（用于计算久期，默认0.01表示1%）
 * @returns 有效久期（年）
 */
export function calculateEffectiveDuration(
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

  // 有效久期 = -(价格变化百分比) / 收益率变化
  const duration = -(priceUp - priceDown) / (2 * price0 * yieldChange);

  return duration;
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
