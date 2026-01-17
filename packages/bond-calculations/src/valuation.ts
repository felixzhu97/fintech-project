/**
 * 债券估值
 */

/**
 * 计算债券理论价格（现值）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param yieldRate 到期收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率（每年付息次数，例如：2 表示半年付息一次）
 * @returns 债券理论价格
 */
export function calculateBondPrice(
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
    // 收益率接近0的特殊情况：价格 = 面值 + 所有利息
    return faceValue + couponPayment * periods;
  }

  // 债券价格 = 现值（利息）+ 现值（面值）
  // 现值（利息）= 息票 * (1 - (1+r)^(-n)) / r
  const pvCoupons = (couponPayment * (1 - Math.pow(1 + periodicYield, -periods))) / periodicYield;

  // 现值（面值）= 面值 / (1+r)^n
  const pvFaceValue = faceValue / Math.pow(1 + periodicYield, periods);

  return pvCoupons + pvFaceValue;
}

/**
 * 计算零息债券价格
 * @param faceValue 面值
 * @param yieldRate 到期收益率（年化，小数形式）
 * @param yearsToMaturity 到期年限
 * @returns 零息债券价格
 */
export function calculateZeroCouponBondPrice(
  faceValue: number,
  yieldRate: number,
  yearsToMaturity: number
): number {
  if (faceValue <= 0 || yearsToMaturity <= 0) {
    throw new Error('参数必须大于0');
  }

  return faceValue / Math.pow(1 + yieldRate, yearsToMaturity);
}

/**
 * 计算债券净价（Clean Price）
 * 净价 = 全价 - 应计利息
 * @param dirtyPrice 全价（Dirty Price）
 * @param accruedInterest 应计利息
 * @returns 净价
 */
export function calculateCleanPrice(dirtyPrice: number, accruedInterest: number): number {
  return dirtyPrice - accruedInterest;
}

/**
 * 计算应计利息（Accrued Interest）
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param couponFrequency 付息频率（每年付息次数）
 * @param daysSinceLastCoupon 上次付息后的天数
 * @param daysInCouponPeriod 付息周期天数
 * @returns 应计利息
 */
export function calculateAccruedInterest(
  faceValue: number,
  couponRate: number,
  couponFrequency: number,
  daysSinceLastCoupon: number,
  daysInCouponPeriod: number
): number {
  if (faceValue <= 0 || couponFrequency <= 0 || daysInCouponPeriod <= 0) {
    throw new Error('参数必须大于0');
  }
  if (daysSinceLastCoupon < 0 || daysSinceLastCoupon > daysInCouponPeriod) {
    throw new Error('上次付息后的天数必须在0到付息周期天数之间');
  }

  const couponPayment = (faceValue * couponRate) / couponFrequency;
  return (couponPayment * daysSinceLastCoupon) / daysInCouponPeriod;
}

/**
 * 计算债券全价（Dirty Price）
 * 全价 = 净价 + 应计利息
 * @param cleanPrice 净价
 * @param accruedInterest 应计利息
 * @returns 全价
 */
export function calculateDirtyPrice(cleanPrice: number, accruedInterest: number): number {
  return cleanPrice + accruedInterest;
}

/**
 * 计算债券的现值（使用现金流贴现）
 * @param cashFlows 现金流数组（包括利息和本金）
 * @param discountRate 贴现率（年化，小数形式）
 * @param periodsPerYear 每年期数（用于将年化贴现率转换为每期贴现率）
 * @returns 债券现值
 */
export function calculatePresentValue(
  cashFlows: number[],
  discountRate: number,
  periodsPerYear: number = 1
): number {
  if (cashFlows.length === 0) {
    throw new Error('现金流数组不能为空');
  }
  if (discountRate < 0 || discountRate > 1) {
    throw new Error('贴现率应在0到1之间');
  }

  const periodicDiscountRate = discountRate / periodsPerYear;

  return cashFlows.reduce((pv, cashFlow, period) => {
    return pv + cashFlow / Math.pow(1 + periodicDiscountRate, period + 1);
  }, 0);
}
