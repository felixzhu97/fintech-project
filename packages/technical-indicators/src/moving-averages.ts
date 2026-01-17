/**
 * 移动平均线相关计算
 */

/**
 * 计算简单移动平均线 (SMA)
 * @param prices 价格数组
 * @param period 周期（例如：20 表示20日移动平均）
 * @returns 移动平均线数组
 */
export function calculateSMA(prices: number[], period: number): number[] {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (period <= 0 || period > prices.length) {
    throw new Error('周期必须大于0且不超过价格数组长度');
  }

  const sma: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }

  return sma;
}

/**
 * 计算指数移动平均线 (EMA)
 * @param prices 价格数组
 * @param period 周期（例如：12 表示12日指数移动平均）
 * @returns 指数移动平均线数组
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (period <= 0 || period > prices.length) {
    throw new Error('周期必须大于0且不超过价格数组长度');
  }

  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  // 第一个EMA值是SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);

  // 计算后续EMA值
  for (let i = period; i < prices.length; i++) {
    const value = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(value);
  }

  return ema;
}

/**
 * 计算加权移动平均线 (WMA)
 * @param prices 价格数组
 * @param period 周期
 * @returns 加权移动平均线数组
 */
export function calculateWMA(prices: number[], period: number): number[] {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (period <= 0 || period > prices.length) {
    throw new Error('周期必须大于0且不超过价格数组长度');
  }

  const wma: number[] = [];
  const weightSum = (period * (period + 1)) / 2;

  for (let i = period - 1; i < prices.length; i++) {
    let weightedSum = 0;
    for (let j = 0; j < period; j++) {
      weightedSum += prices[i - period + 1 + j] * (j + 1);
    }
    wma.push(weightedSum / weightSum);
  }

  return wma;
}

/**
 * 计算双重指数移动平均线 (DEMA)
 * @param prices 价格数组
 * @param period 周期
 * @returns DEMA数组
 */
export function calculateDEMA(prices: number[], period: number): number[] {
  const ema1 = calculateEMA(prices, period);
  const ema2 = calculateEMA(ema1, period);

  const dema: number[] = [];
  const offset = ema1.length - ema2.length;

  for (let i = 0; i < ema2.length; i++) {
    dema.push(2 * ema1[i + offset] - ema2[i]);
  }

  return dema;
}
