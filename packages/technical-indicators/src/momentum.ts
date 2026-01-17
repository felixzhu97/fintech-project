/**
 * 动量指标计算
 */

import { calculateEMA } from './moving-averages';

/**
 * MACD 结果接口
 */
export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

/**
 * 计算 MACD（指数平滑异同移动平均线）
 * @param prices 价格数组
 * @param fastPeriod 快线周期，默认12
 * @param slowPeriod 慢线周期，默认26
 * @param signalPeriod 信号线周期，默认9
 * @returns MACD指标结果
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0) {
    throw new Error('周期必须大于0');
  }
  if (fastPeriod >= slowPeriod) {
    throw new Error('快线周期必须小于慢线周期');
  }

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  // 计算MACD线（快EMA - 慢EMA）
  const macd: number[] = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);
  const fastOffset = fastEMA.length - minLength;
  const slowOffset = slowEMA.length - minLength;

  for (let i = 0; i < minLength; i++) {
    macd.push(fastEMA[i + fastOffset] - slowEMA[i + slowOffset]);
  }

  // 计算信号线（MACD的EMA）
  const signal = calculateEMA(macd, signalPeriod);

  // 计算柱状图（MACD - 信号线）
  const histogram: number[] = [];
  const signalOffset = macd.length - signal.length;

  for (let i = 0; i < signal.length; i++) {
    histogram.push(macd[i + signalOffset] - signal[i]);
  }

  return { macd, signal, histogram };
}

/**
 * 计算 RSI（相对强弱指标）
 * @param prices 价格数组
 * @param period 周期，默认14
 * @returns RSI数组
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < period + 1) {
    throw new Error(`价格数组长度必须至少为 ${period + 1}`);
  }
  if (period <= 0) {
    throw new Error('周期必须大于0');
  }

  // 计算价格变化
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains: number[] = changes.map((c) => (c > 0 ? c : 0));
  const losses: number[] = changes.map((c) => (c < 0 ? -c : 0));

  const rsi: number[] = [];

  // 初始平均收益和损失
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) {
    rsi.push(100);
  } else {
    const rs = avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  // 使用平滑移动平均计算后续RSI
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }

  return rsi;
}

/**
 * 计算随机指标 (KDJ)
 * @param highPrices 最高价数组
 * @param lowPrices 最低价数组
 * @param closePrices 收盘价数组
 * @param period 周期，默认9
 * @param kPeriod K值平滑周期，默认3
 * @param dPeriod D值平滑周期，默认3
 * @returns KDJ指标结果 {k, d, j}
 */
export function calculateKDJ(
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  period: number = 9,
  kPeriod: number = 3,
  dPeriod: number = 3
): { k: number[]; d: number[]; j: number[] } {
  if (highPrices.length !== lowPrices.length || highPrices.length !== closePrices.length) {
    throw new Error('价格数组长度必须一致');
  }
  if (highPrices.length < period) {
    throw new Error(`价格数组长度必须至少为 ${period}`);
  }
  if (period <= 0 || kPeriod <= 0 || dPeriod <= 0) {
    throw new Error('周期必须大于0');
  }

  const rsv: number[] = [];

  // 计算RSV（未成熟随机值）
  for (let i = period - 1; i < highPrices.length; i++) {
    const high = Math.max(...highPrices.slice(i - period + 1, i + 1));
    const low = Math.min(...lowPrices.slice(i - period + 1, i + 1));
    const close = closePrices[i];

    if (high === low) {
      rsv.push(50); // 避免除零
    } else {
      rsv.push(((close - low) / (high - low)) * 100);
    }
  }

  // 计算K值（RSV的平滑移动平均）
  const k: number[] = [];
  let kValue = 50; // 初始K值

  for (const rsvValue of rsv) {
    kValue = (kValue * (kPeriod - 1) + rsvValue) / kPeriod;
    k.push(kValue);
  }

  // 计算D值（K值的平滑移动平均）
  const d: number[] = [];
  let dValue = 50; // 初始D值

  for (const kValue of k) {
    dValue = (dValue * (dPeriod - 1) + kValue) / dPeriod;
    d.push(dValue);
  }

  // 计算J值（J = 3K - 2D）
  const j = k.map((kValue, i) => 3 * kValue - 2 * d[i]);

  return { k, d, j };
}
