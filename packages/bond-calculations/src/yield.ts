/**
 * 债券收益率计算
 */

/**
 * 计算到期收益率（YTM - Yield to Maturity）
 * 使用牛顿-拉夫逊方法求解
 * @param faceValue 面值
 * @param couponRate 票面利率（年化，小数形式）
 * @param price 当前价格
 * @param yearsToMaturity 到期年限
 * @param couponFrequency 付息频率（每年付息次数，例如：2 表示半年付息一次）
 * @param tolerance 容差，默认1e-6
 * @param maxIterations 最大迭代次数，默认100
 * @returns 到期收益率（年化，小数形式）
 */
export function calculateYTM(
  faceValue: number,
  couponRate: number,
  price: number,
  yearsToMaturity: number,
  couponFrequency: number = 2,
  tolerance: number = 1e-6,
  maxIterations: number = 100
): number {
  if (faceValue <= 0 || price <= 0 || yearsToMaturity <= 0 || couponFrequency <= 0) {
    throw new Error('参数必须大于0');
  }

  const couponPayment = (faceValue * couponRate) / couponFrequency;
  const periods = yearsToMaturity * couponFrequency;

  // 初始猜测收益率
  let ytm = couponRate; // 从票面利率开始

  for (let i = 0; i < maxIterations; i++) {
    const calculatedPrice = calculateBondPrice(
      faceValue,
      couponRate,
      ytm,
      yearsToMaturity,
      couponFrequency
    );

    const error = calculatedPrice - price;

    if (Math.abs(error) < tolerance) {
      return ytm;
    }

    // 计算导数（价格对收益率的敏感性）
    const derivative = calculateBondPriceDerivative(
      faceValue,
      couponRate,
      ytm,
      yearsToMaturity,
      couponFrequency
    );

    if (Math.abs(derivative) < 1e-10) {
      break; // 导数太小，无法继续迭代
    }

    // 牛顿-拉夫逊方法更新
    ytm = ytm - error / derivative;

    // 确保收益率在合理范围内
    ytm = Math.max(-1, Math.min(1, ytm));
  }

  return ytm;
}

/**
 * 计算债券价格（给定收益率）
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
    // 收益率接近0的特殊情况
    return faceValue + couponPayment * periods;
  }

  // 债券价格 = 现值（利息）+ 现值（面值）
  const pvCoupons = (couponPayment * (1 - Math.pow(1 + periodicYield, -periods))) / periodicYield;
  const pvFaceValue = faceValue / Math.pow(1 + periodicYield, periods);

  return pvCoupons + pvFaceValue;
}

/**
 * 计算债券价格对收益率的导数
 */
function calculateBondPriceDerivative(
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
    return -periods * faceValue / couponFrequency;
  }

  const term1 = -couponPayment * periods / (periodicYield * periodicYield) *
    (1 - Math.pow(1 + periodicYield, -periods));
  const term2 = couponPayment * periods / (periodicYield * Math.pow(1 + periodicYield, periods + 1));
  const term3 = -faceValue * periods / (couponFrequency * Math.pow(1 + periodicYield, periods + 1));

  return (term1 + term2 + term3) / couponFrequency;
}

/**
 * 计算当前收益率（Current Yield）
 * @param couponPayment 年息票支付
 * @param price 当前价格
 * @returns 当前收益率（年化，小数形式）
 */
export function calculateCurrentYield(couponPayment: number, price: number): number {
  if (price <= 0) {
    throw new Error('价格必须大于0');
  }
  return couponPayment / price;
}

/**
 * 计算持有期收益率（HPR - Holding Period Return）
 * @param purchasePrice 购买价格
 * @param sellingPrice 出售价格
 * @param couponPayments 持有期间的息票支付总和
 * @returns 持有期收益率（小数形式）
 */
export function calculateHPR(
  purchasePrice: number,
  sellingPrice: number,
  couponPayments: number
): number {
  if (purchasePrice <= 0) {
    throw new Error('购买价格必须大于0');
  }
  return (sellingPrice + couponPayments - purchasePrice) / purchasePrice;
}

/**
 * 计算年化持有期收益率
 * @param purchasePrice 购买价格
 * @param sellingPrice 出售价格
 * @param couponPayments 持有期间的息票支付总和
 * @param holdingPeriodYears 持有年限
 * @returns 年化持有期收益率（小数形式）
 */
export function calculateAnnualizedHPR(
  purchasePrice: number,
  sellingPrice: number,
  couponPayments: number,
  holdingPeriodYears: number
): number {
  if (holdingPeriodYears <= 0) {
    throw new Error('持有年限必须大于0');
  }
  const hpr = calculateHPR(purchasePrice, sellingPrice, couponPayments);
  return Math.pow(1 + hpr, 1 / holdingPeriodYears) - 1;
}
