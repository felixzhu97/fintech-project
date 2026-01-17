/**
 * 波动率指标计算
 */

/**
 * 布林带结果接口
 */
export interface BollingerBandsResult {
  upper: number[];
  middle: number[];
  lower: number[];
}

/**
 * 计算布林带 (Bollinger Bands)
 * @param prices 价格数组
 * @param period 周期，默认20
 * @param stdDev 标准差倍数，默认2
 * @returns 布林带指标结果
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): BollingerBandsResult {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (period <= 0 || period > prices.length) {
    throw new Error('周期必须大于0且不超过价格数组长度');
  }
  if (stdDev <= 0) {
    throw new Error('标准差倍数必须大于0');
  }

  const upper: number[] = [];
  const middle: number[] = [];
  const lower: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);

    // 计算中轨（SMA）
    const sma = slice.reduce((a, b) => a + b, 0) / period;
    middle.push(sma);

    // 计算标准差
    const variance =
      slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    // 计算上轨和下轨
    upper.push(sma + stdDev * standardDeviation);
    lower.push(sma - stdDev * standardDeviation);
  }

  return { upper, middle, lower };
}

/**
 * 计算平均真实波动范围 (ATR)
 * @param highPrices 最高价数组
 * @param lowPrices 最低价数组
 * @param closePrices 收盘价数组（前一日）
 * @param period 周期，默认14
 * @returns ATR数组
 */
export function calculateATR(
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  period: number = 14
): number[] {
  if (
    highPrices.length !== lowPrices.length ||
    highPrices.length !== closePrices.length
  ) {
    throw new Error('价格数组长度必须一致');
  }
  if (highPrices.length < period + 1) {
    throw new Error(`价格数组长度必须至少为 ${period + 1}`);
  }
  if (period <= 0) {
    throw new Error('周期必须大于0');
  }

  // 计算真实波动范围 (TR)
  const tr: number[] = [];

  for (let i = 1; i < highPrices.length; i++) {
    const tr1 = highPrices[i] - lowPrices[i];
    const tr2 = Math.abs(highPrices[i] - closePrices[i - 1]);
    const tr3 = Math.abs(lowPrices[i] - closePrices[i - 1]);
    tr.push(Math.max(tr1, tr2, tr3));
  }

  // 计算ATR（TR的移动平均）
  const atr: number[] = [];

  // 初始ATR是前period个TR的平均值
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += tr[i];
  }
  atr.push(sum / period);

  // 使用平滑移动平均计算后续ATR
  for (let i = period; i < tr.length; i++) {
    const value = (atr[atr.length - 1] * (period - 1) + tr[i]) / period;
    atr.push(value);
  }

  return atr;
}

/**
 * 计算标准差通道
 * @param prices 价格数组
 * @param period 周期，默认20
 * @param stdDev 标准差倍数，默认2
 * @returns 标准差通道结果 {upper, middle, lower}
 */
export function calculateStdDevChannel(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }
  if (period <= 0 || period > prices.length) {
    throw new Error('周期必须大于0且不超过价格数组长度');
  }
  if (stdDev <= 0) {
    throw new Error('标准差倍数必须大于0');
  }

  const upper: number[] = [];
  const middle: number[] = [];
  const lower: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);

    // 计算中轨（均值）
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    middle.push(mean);

    // 计算标准差
    const variance =
      slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    // 计算上轨和下轨
    upper.push(mean + stdDev * standardDeviation);
    lower.push(mean - stdDev * standardDeviation);
  }

  return { upper, middle, lower };
}
