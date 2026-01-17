/**
 * 股息折现模型（DDM - Dividend Discount Model）
 */

/**
 * 零增长DDM模型（固定股息）
 * @param dividend 每股股息
 * @param discountRate 贴现率（要求回报率，年化，小数形式）
 * @returns 股票理论价格
 */
export function zeroGrowthDDM(dividend: number, discountRate: number): number {
  if (discountRate <= 0 || discountRate >= 1) {
    throw new Error('贴现率应在0到1之间');
  }
  if (dividend <= 0) {
    throw new Error('股息必须大于0');
  }
  return dividend / discountRate;
}

/**
 * 固定增长DDM模型（Gordon增长模型）
 * @param currentDividend 当前每股股息
 * @param growthRate 股息增长率（年化，小数形式）
 * @param discountRate 贴现率（要求回报率，年化，小数形式）
 * @returns 股票理论价格
 */
export function constantGrowthDDM(
  currentDividend: number,
  growthRate: number,
  discountRate: number
): number {
  if (discountRate <= 0 || discountRate >= 1) {
    throw new Error('贴现率应在0到1之间');
  }
  if (growthRate >= discountRate) {
    throw new Error('增长率必须小于贴现率');
  }
  if (currentDividend <= 0) {
    throw new Error('当前股息必须大于0');
  }

  const nextYearDividend = currentDividend * (1 + growthRate);
  return nextYearDividend / (discountRate - growthRate);
}

/**
 * 两阶段增长DDM模型
 * @param currentDividend 当前每股股息
 * @param highGrowthRate 高增长阶段的增长率（年化，小数形式）
 * @param highGrowthYears 高增长阶段的年数
 * @param stableGrowthRate 稳定增长阶段的增长率（年化，小数形式）
 * @param discountRate 贴现率（要求回报率，年化，小数形式）
 * @returns 股票理论价格
 */
export function twoStageDDM(
  currentDividend: number,
  highGrowthRate: number,
  highGrowthYears: number,
  stableGrowthRate: number,
  discountRate: number
): number {
  if (discountRate <= 0 || discountRate >= 1) {
    throw new Error('贴现率应在0到1之间');
  }
  if (highGrowthRate >= discountRate) {
    throw new Error('高增长阶段的增长率必须小于贴现率');
  }
  if (stableGrowthRate >= discountRate) {
    throw new Error('稳定增长阶段的增长率必须小于贴现率');
  }
  if (currentDividend <= 0 || highGrowthYears <= 0) {
    throw new Error('当前股息和高增长年数必须大于0');
  }

  // 第一阶段：高增长阶段的股息现值
  let pvHighGrowthStage = 0;
  let dividend = currentDividend;

  for (let year = 1; year <= highGrowthYears; year++) {
    dividend *= 1 + highGrowthRate;
    pvHighGrowthStage += dividend / Math.pow(1 + discountRate, year);
  }

  // 第二阶段：稳定增长阶段（终值）
  const terminalDividend = dividend * (1 + stableGrowthRate);
  const terminalValue = terminalDividend / (discountRate - stableGrowthRate);
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, highGrowthYears);

  return pvHighGrowthStage + pvTerminalValue;
}

/**
 * 三阶段增长DDM模型
 * @param currentDividend 当前每股股息
 * @param highGrowthRate 高增长阶段的增长率（年化，小数形式）
 * @param highGrowthYears 高增长阶段的年数
 * @param transitionGrowthRate 过渡阶段的增长率（年化，小数形式）
 * @param transitionYears 过渡阶段的年数
 * @param stableGrowthRate 稳定增长阶段的增长率（年化，小数形式）
 * @param discountRate 贴现率（要求回报率，年化，小数形式）
 * @returns 股票理论价格
 */
export function threeStageDDM(
  currentDividend: number,
  highGrowthRate: number,
  highGrowthYears: number,
  transitionGrowthRate: number,
  transitionYears: number,
  stableGrowthRate: number,
  discountRate: number
): number {
  if (discountRate <= 0 || discountRate >= 1) {
    throw new Error('贴现率应在0到1之间');
  }
  if (stableGrowthRate >= discountRate) {
    throw new Error('稳定增长阶段的增长率必须小于贴现率');
  }
  if (currentDividend <= 0 || highGrowthYears <= 0 || transitionYears <= 0) {
    throw new Error('当前股息和增长年数必须大于0');
  }

  let pv = 0;
  let dividend = currentDividend;

  // 第一阶段：高增长阶段
  for (let year = 1; year <= highGrowthYears; year++) {
    dividend *= 1 + highGrowthRate;
    pv += dividend / Math.pow(1 + discountRate, year);
  }

  // 第二阶段：过渡阶段（增长率逐步下降）
  const growthStep = (highGrowthRate - stableGrowthRate) / (transitionYears + 1);

  for (let year = 1; year <= transitionYears; year++) {
    const currentGrowthRate = highGrowthRate - growthStep * year;
    dividend *= 1 + currentGrowthRate;
    pv += dividend / Math.pow(1 + discountRate, highGrowthYears + year);
  }

  // 第三阶段：稳定增长阶段（终值）
  const terminalDividend = dividend * (1 + stableGrowthRate);
  const terminalValue = terminalDividend / (discountRate - stableGrowthRate);
  pv += terminalValue / Math.pow(1 + discountRate, highGrowthYears + transitionYears);

  return pv;
}

/**
 * 计算股息收益率（Dividend Yield）
 * @param dividend 每股股息
 * @param price 股价
 * @returns 股息收益率（小数形式）
 */
export function calculateDividendYield(dividend: number, price: number): number {
  if (price <= 0) {
    throw new Error('股价必须大于0');
  }
  return dividend / price;
}

/**
 * 计算股息支付率（Dividend Payout Ratio）
 * @param dividend 每股股息
 * @param earningsPerShare 每股收益
 * @returns 股息支付率（小数形式）
 */
export function calculateDividendPayoutRatio(dividend: number, earningsPerShare: number): number {
  if (earningsPerShare <= 0) {
    throw new Error('每股收益必须大于0');
  }
  return dividend / earningsPerShare;
}
