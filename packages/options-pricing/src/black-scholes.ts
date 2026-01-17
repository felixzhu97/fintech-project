/**
 * Black-Scholes 期权定价模型
 */

/**
 * 期权类型
 */
export type OptionType = 'call' | 'put';

/**
 * 标准正态分布的累积分布函数近似（使用误差函数）
 */
function normCDF(x: number): number {
  // Abramowitz and Stegun 近似
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/**
 * 标准正态分布的概率密度函数
 */
function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Black-Scholes 期权定价
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param optionType 期权类型：'call' 看涨期权，'put' 看跌期权
 * @returns 期权价格
 */
export function blackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: OptionType = 'call'
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
    throw new Error('参数必须大于0');
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  let price: number;

  if (optionType === 'call') {
    price = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  } else {
    price = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  }

  return price;
}

/**
 * 计算隐含波动率（使用二分查找法）
 * @param marketPrice 市场价格
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param optionType 期权类型
 * @param tolerance 容差，默认1e-6
 * @param maxIterations 最大迭代次数，默认100
 * @returns 隐含波动率（年化，小数形式）
 */
export function calculateImpliedVolatility(
  marketPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  optionType: OptionType = 'call',
  tolerance: number = 1e-6,
  maxIterations: number = 100
): number {
  if (marketPrice <= 0) {
    throw new Error('市场价格必须大于0');
  }

  let lowVol = 0.001;
  let highVol = 5.0;
  let midVol = (lowVol + highVol) / 2;

  for (let i = 0; i < maxIterations; i++) {
    midVol = (lowVol + highVol) / 2;
    const price = blackScholes(S, K, T, r, midVol, optionType);
    const diff = price - marketPrice;

    if (Math.abs(diff) < tolerance) {
      return midVol;
    }

    if (diff > 0) {
      highVol = midVol;
    } else {
      lowVol = midVol;
    }
  }

  return midVol; // 返回最后一次迭代的结果
}
