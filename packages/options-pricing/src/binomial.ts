/**
 * 二叉树期权定价模型
 */

import { OptionType } from './black-scholes';

/**
 * 二叉树期权定价
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param n 二叉树步数，默认100
 * @param optionType 期权类型：'call' 看涨期权，'put' 看跌期权
 * @returns 期权价格
 */
export function binomialTree(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  n: number = 100,
  optionType: OptionType = 'call'
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0 || n <= 0) {
    throw new Error('参数必须大于0');
  }

  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt)); // 上涨因子
  const d = 1 / u; // 下跌因子
  const p = (Math.exp(r * dt) - d) / (u - d); // 风险中性概率
  const discount = Math.exp(-r * dt);

  // 计算到期日的期权价值
  const optionValues: number[] = [];

  for (let i = 0; i <= n; i++) {
    const stockPrice = S * Math.pow(u, n - i) * Math.pow(d, i);
    let optionValue: number;

    if (optionType === 'call') {
      optionValue = Math.max(0, stockPrice - K);
    } else {
      optionValue = Math.max(0, K - stockPrice);
    }

    optionValues.push(optionValue);
  }

  // 向后递归计算期权价格
  for (let j = n - 1; j >= 0; j--) {
    for (let i = 0; i <= j; i++) {
      const stockPrice = S * Math.pow(u, j - i) * Math.pow(d, i);
      const optionValueUp = optionValues[i];
      const optionValueDown = optionValues[i + 1];

      // 风险中性定价：期权价值 = 折现后的期望值
      const optionValue = discount * (p * optionValueUp + (1 - p) * optionValueDown);

      // 对于美式期权，需要考虑提前执行
      let exerciseValue: number;
      if (optionType === 'call') {
        exerciseValue = Math.max(0, stockPrice - K);
      } else {
        exerciseValue = Math.max(0, K - stockPrice);
      }

      optionValues[i] = Math.max(optionValue, exerciseValue);
    }
  }

  return optionValues[0];
}

/**
 * 美式期权定价（二叉树模型）
 * 美式期权可以在到期前任何时间执行
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param n 二叉树步数，默认100
 * @param optionType 期权类型
 * @returns 期权价格
 */
export function americanOption(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  n: number = 100,
  optionType: OptionType = 'call'
): number {
  // 美式期权在二叉树模型中已经考虑了提前执行
  return binomialTree(S, K, T, r, sigma, n, optionType);
}

/**
 * 欧式期权定价（二叉树模型）
 * 欧式期权只能在到期日执行
 * @param S 标的资产当前价格
 * @param K 执行价格
 * @param T 到期时间（年）
 * @param r 无风险利率（年化，小数形式）
 * @param sigma 波动率（年化，小数形式）
 * @param n 二叉树步数，默认100
 * @param optionType 期权类型
 * @returns 期权价格
 */
export function europeanOption(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  n: number = 100,
  optionType: OptionType = 'call'
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0 || n <= 0) {
    throw new Error('参数必须大于0');
  }

  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);
  const discount = Math.exp(-r * dt);

  // 计算到期日的期权价值
  const optionValues: number[] = [];

  for (let i = 0; i <= n; i++) {
    const stockPrice = S * Math.pow(u, n - i) * Math.pow(d, i);
    let optionValue: number;

    if (optionType === 'call') {
      optionValue = Math.max(0, stockPrice - K);
    } else {
      optionValue = Math.max(0, K - stockPrice);
    }

    optionValues.push(optionValue);
  }

  // 向后递归计算期权价格（不考虑提前执行）
  for (let j = n - 1; j >= 0; j--) {
    for (let i = 0; i <= j; i++) {
      const optionValueUp = optionValues[i];
      const optionValueDown = optionValues[i + 1];

      // 风险中性定价
      optionValues[i] = discount * (p * optionValueUp + (1 - p) * optionValueDown);
    }
  }

  return optionValues[0];
}
