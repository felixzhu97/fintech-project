/**
 * 成交量指标计算
 */

/**
 * 计算能量潮 (OBV - On Balance Volume)
 * @param prices 收盘价数组
 * @param volumes 成交量数组
 * @returns OBV数组
 */
export function calculateOBV(prices: number[], volumes: number[]): number[] {
  if (prices.length !== volumes.length) {
    throw new Error('价格数组和成交量数组长度必须一致');
  }
  if (prices.length === 0) {
    throw new Error('价格数组不能为空');
  }

  const obv: number[] = [];
  let cumulativeOBV = volumes[0]; // 初始OBV为第一个成交量
  obv.push(cumulativeOBV);

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      // 收盘价上涨，成交量累加
      cumulativeOBV += volumes[i];
    } else if (prices[i] < prices[i - 1]) {
      // 收盘价下跌，成交量累减
      cumulativeOBV -= volumes[i];
    } else {
      // 收盘价不变，OBV不变
      // cumulativeOBV 保持不变
    }
    obv.push(cumulativeOBV);
  }

  return obv;
}

/**
 * 计算成交量移动平均
 * @param volumes 成交量数组
 * @param period 周期，默认20
 * @returns 成交量移动平均数组
 */
export function calculateVolumeMA(volumes: number[], period: number = 20): number[] {
  if (volumes.length === 0) {
    throw new Error('成交量数组不能为空');
  }
  if (period <= 0 || period > volumes.length) {
    throw new Error('周期必须大于0且不超过成交量数组长度');
  }

  const volumeMA: number[] = [];

  for (let i = period - 1; i < volumes.length; i++) {
    const sum = volumes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    volumeMA.push(sum / period);
  }

  return volumeMA;
}

/**
 * 计算成交量相对强弱指标 (VRSI)
 * @param volumes 成交量数组
 * @param period 周期，默认14
 * @returns VRSI数组
 */
export function calculateVRSI(volumes: number[], period: number = 14): number[] {
  if (volumes.length < period + 1) {
    throw new Error(`成交量数组长度必须至少为 ${period + 1}`);
  }
  if (period <= 0) {
    throw new Error('周期必须大于0');
  }

  // 计算成交量变化
  const changes: number[] = [];
  for (let i = 1; i < volumes.length; i++) {
    changes.push(volumes[i] - volumes[i - 1]);
  }

  const gains: number[] = changes.map((c) => (c > 0 ? c : 0));
  const losses: number[] = changes.map((c) => (c < 0 ? -c : 0));

  const vrsi: number[] = [];

  // 初始平均收益和损失
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) {
    vrsi.push(100);
  } else {
    const rs = avgGain / avgLoss;
    vrsi.push(100 - 100 / (1 + rs));
  }

  // 使用平滑移动平均计算后续VRSI
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      vrsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      vrsi.push(100 - 100 / (1 + rs));
    }
  }

  return vrsi;
}

/**
 * 计算成交量比率 (VR - Volume Ratio)
 * @param prices 收盘价数组
 * @param volumes 成交量数组
 * @param period 周期，默认26
 * @returns VR数组
 */
export function calculateVR(
  prices: number[],
  volumes: number[],
  period: number = 26
): number[] {
  if (prices.length !== volumes.length) {
    throw new Error('价格数组和成交量数组长度必须一致');
  }
  if (prices.length < period + 1) {
    throw new Error(`价格数组长度必须至少为 ${period + 1}`);
  }
  if (period <= 0) {
    throw new Error('周期必须大于0');
  }

  const vr: number[] = [];

  for (let i = period; i < prices.length; i++) {
    const priceSlice = prices.slice(i - period + 1, i + 1);
    const volumeSlice = volumes.slice(i - period + 1, i + 1);
    const previousPrice = prices[i - period];

    let upVolume = 0;
    let downVolume = 0;
    let unchangedVolume = 0;

    for (let j = 0; j < priceSlice.length; j++) {
      const currentPrice = priceSlice[j];
      const volume = volumeSlice[j];

      if (currentPrice > previousPrice) {
        upVolume += volume;
      } else if (currentPrice < previousPrice) {
        downVolume += volume;
      } else {
        unchangedVolume += volume;
      }
    }

    const denominator = downVolume + unchangedVolume / 2;
    if (denominator === 0) {
      vr.push(100); // 避免除零
    } else {
      vr.push(((upVolume + unchangedVolume / 2) / denominator) * 100);
    }
  }

  return vr;
}

/**
 * 计算累计成交量分布 (A/D - Accumulation/Distribution)
 * @param highPrices 最高价数组
 * @param lowPrices 最低价数组
 * @param closePrices 收盘价数组
 * @param volumes 成交量数组
 * @returns A/D数组
 */
export function calculateAD(
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  volumes: number[]
): number[] {
  if (
    highPrices.length !== lowPrices.length ||
    highPrices.length !== closePrices.length ||
    highPrices.length !== volumes.length
  ) {
    throw new Error('所有价格和成交量数组长度必须一致');
  }
  if (highPrices.length === 0) {
    throw new Error('价格数组不能为空');
  }

  const ad: number[] = [];
  let cumulativeAD = 0;

  for (let i = 0; i < highPrices.length; i++) {
    const high = highPrices[i];
    const low = lowPrices[i];
    const close = closePrices[i];
    const volume = volumes[i];

    if (high === low) {
      // 避免除零，当最高价等于最低价时，A/D不变
      ad.push(cumulativeAD);
      continue;
    }

    // 计算资金流量乘数 (Money Flow Multiplier)
    const mfm = ((close - low) - (high - close)) / (high - low);

    // 计算资金流量 (Money Flow Volume)
    const mfv = mfm * volume;

    // 累加A/D
    cumulativeAD += mfv;
    ad.push(cumulativeAD);
  }

  return ad;
}
