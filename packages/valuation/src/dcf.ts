/**
 * DCF（贴现现金流）模型
 */

/**
 * DCF估值参数
 */
export interface DCFParams {
  freeCashFlows: number[]; // 自由现金流数组（预期未来现金流）
  terminalGrowthRate?: number; // 终值增长率（年化，小数形式），默认0
  discountRate: number; // 贴现率（WACC，年化，小数形式）
  terminalMultiple?: number; // 终值倍数（如使用倍数法计算终值）
  terminalYearFCF?: number; // 终值年的自由现金流（用于倍数法）
}

/**
 * 使用DCF模型计算企业价值
 * @param params DCF参数
 * @returns 企业价值
 */
export function calculateDCFValue(params: DCFParams): number {
  const {
    freeCashFlows,
    terminalGrowthRate = 0,
    discountRate,
    terminalMultiple,
    terminalYearFCF,
  } = params;

  if (freeCashFlows.length === 0) {
    throw new Error('自由现金流数组不能为空');
  }
  if (discountRate <= 0 || discountRate >= 1) {
    throw new Error('贴现率应在0到1之间');
  }

  // 计算预测期现金流的现值
  let pvCashFlows = 0;
  for (let i = 0; i < freeCashFlows.length; i++) {
    const fcf = freeCashFlows[i];
    const pv = fcf / Math.pow(1 + discountRate, i + 1);
    pvCashFlows += pv;
  }

  // 计算终值（Terminal Value）
  let terminalValue = 0;

  if (terminalMultiple !== undefined && terminalYearFCF !== undefined) {
    // 使用倍数法计算终值：终值 = 终值年FCF * 倍数
    terminalValue = terminalYearFCF * terminalMultiple;
  } else {
    // 使用永续增长模型（Gordon Growth Model）计算终值
    const lastFCF = freeCashFlows[freeCashFlows.length - 1];
    if (terminalGrowthRate >= discountRate) {
      throw new Error('终值增长率必须小于贴现率');
    }
    terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  }

  // 计算终值的现值
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, freeCashFlows.length);

  // 企业价值 = 预测期现金流现值 + 终值现值
  return pvCashFlows + pvTerminalValue;
}

/**
 * 计算股权价值（从企业价值推导）
 * @param enterpriseValue 企业价值
 * @param debt 债务
 * @param cash 现金及现金等价物
 * @param minorityInterest 少数股东权益
 * @returns 股权价值
 */
export function calculateEquityValue(
  enterpriseValue: number,
  debt: number,
  cash: number,
  minorityInterest: number = 0
): number {
  return enterpriseValue - debt + cash - minorityInterest;
}

/**
 * 计算每股价值
 * @param equityValue 股权价值
 * @param sharesOutstanding 流通股数量
 * @returns 每股价值
 */
export function calculateValuePerShare(equityValue: number, sharesOutstanding: number): number {
  if (sharesOutstanding <= 0) {
    throw new Error('流通股数量必须大于0');
  }
  return equityValue / sharesOutstanding;
}

/**
 * 计算加权平均资本成本（WACC）
 * @param equityValue 股权价值
 * @param debtValue 债务价值
 * @param costOfEquity 股权成本（小数形式）
 * @param costOfDebt 债务成本（小数形式）
 * @param taxRate 税率（小数形式）
 * @returns WACC（小数形式）
 */
export function calculateWACC(
  equityValue: number,
  debtValue: number,
  costOfEquity: number,
  costOfDebt: number,
  taxRate: number
): number {
  const totalValue = equityValue + debtValue;

  if (totalValue === 0) {
    throw new Error('总价值不能为0');
  }

  const equityWeight = equityValue / totalValue;
  const debtWeight = debtValue / totalValue;

  // WACC = E/V * Re + D/V * Rd * (1 - Tc)
  return equityWeight * costOfEquity + debtWeight * costOfDebt * (1 - taxRate);
}

/**
 * 计算永续增长模型的价值（Gordon Growth Model）
 * @param nextYearCashFlow 下一年的现金流
 * @param growthRate 增长率（年化，小数形式）
 * @param discountRate 贴现率（年化，小数形式）
 * @returns 现值
 */
export function calculateGordonGrowthModel(
  nextYearCashFlow: number,
  growthRate: number,
  discountRate: number
): number {
  if (growthRate >= discountRate) {
    throw new Error('增长率必须小于贴现率');
  }
  if (discountRate <= 0) {
    throw new Error('贴现率必须大于0');
  }

  return nextYearCashFlow / (discountRate - growthRate);
}
