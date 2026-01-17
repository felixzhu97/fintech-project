/**
 * 期权希腊字母计算
 */

import { blackScholes, OptionType } from './black-scholes';

/**
 * 标准正态分布的累积分布函数近似
 */
function normCDF(x: number): number {
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
 * 期权Greeks结果接口
 */
export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

/**
 * 计算期权Delta（价格对标的资产价格的敏感性）
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param optionType 期权类型
 * @returns Delta值
 */
export function calculateDelta(
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

  if (optionType === 'call') {
    return normCDF(d1);
  } else {
    return normCDF(d1) - 1;
  }
}

/**
 * 计算期权Gamma（Delta对标的资产价格的敏感性）
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @returns Gamma值
 */
export function calculateGamma(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
    throw new Error('参数必须大于0');
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  return normPDF(d1) / (S * sigma * Math.sqrt(T));
}

/**
 * 计算期权Theta（价格对时间的敏感性，即时间衰减）
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param optionType 期权类型
 * @returns Theta值（每天）
 */
export function calculateTheta(
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

  const term1 = (-S * normPDF(d1) * sigma) / (2 * Math.sqrt(T));
  const term2 = -r * K * Math.exp(-r * T) * normCDF(optionType === 'call' ? d2 : -d2);

  // 转换为每天的值（一年365天）
  return (term1 + term2) / 365;
}

/**
 * 计算期权Vega（价格对波动率的敏感性）
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @returns Vega值（波动率变化1%）
 */
export function calculateVega(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
    throw new Error('参数必须大于0');
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  return (S * normPDF(d1) * Math.sqrt(T)) / 100; // 转换为波动率变化1%的值
}

/**
 * 计算期权Rho（价格对无风险利率的敏感性）
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param optionType 期权类型
 * @returns Rho值（利率变化1%）
 */
export function calculateRho(
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

  if (optionType === 'call') {
    return (K * T * Math.exp(-r * T) * normCDF(d2)) / 100; // 转换为利率变化1%的值
  } else {
    return (-K * T * Math.exp(-r * T) * normCDF(-d2)) / 100;
  }
}

/**
 * 计算所有期权Greeks
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param optionType 期权类型
 * @returns 所有Greeks值
 */
export function calculateAllGreeks(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: OptionType = 'call'
): Greeks {
  return {
    delta: calculateDelta(S, K, T, r, sigma, optionType),
    gamma: calculateGamma(S, K, T, r, sigma),
    theta: calculateTheta(S, K, T, r, sigma, optionType),
    vega: calculateVega(S, K, T, r, sigma),
    rho: calculateRho(S, K, T, r, sigma, optionType),
  };
}
