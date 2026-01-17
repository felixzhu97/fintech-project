/**
 * 相对估值模型
 */

/**
 * 计算市盈率（P/E Ratio）
 * @param price 股价
 * @param earningsPerShare 每股收益（EPS）
 * @returns 市盈率
 */
export function calculatePERatio(price: number, earningsPerShare: number): number {
  if (earningsPerShare <= 0) {
    throw new Error('每股收益必须大于0');
  }
  return price / earningsPerShare;
}

/**
 * 使用市盈率估值
 * @param earningsPerShare 每股收益
 * @param industryPERatio 行业平均市盈率
 * @returns 估计股价
 */
export function valueByPERatio(earningsPerShare: number, industryPERatio: number): number {
  if (industryPERatio <= 0) {
    throw new Error('行业市盈率必须大于0');
  }
  return earningsPerShare * industryPERatio;
}

/**
 * 计算市净率（P/B Ratio）
 * @param price 股价
 * @param bookValuePerShare 每股净资产
 * @returns 市净率
 */
export function calculatePBRatio(price: number, bookValuePerShare: number): number {
  if (bookValuePerShare <= 0) {
    throw new Error('每股净资产必须大于0');
  }
  return price / bookValuePerShare;
}

/**
 * 使用市净率估值
 * @param bookValuePerShare 每股净资产
 * @param industryPBRatio 行业平均市净率
 * @returns 估计股价
 */
export function valueByPBRatio(bookValuePerShare: number, industryPBRatio: number): number {
  if (industryPBRatio <= 0) {
    throw new Error('行业市净率必须大于0');
  }
  return bookValuePerShare * industryPBRatio;
}

/**
 * 计算市销率（P/S Ratio）
 * @param price 股价
 * @param salesPerShare 每股销售收入
 * @returns 市销率
 */
export function calculatePSRatio(price: number, salesPerShare: number): number {
  if (salesPerShare <= 0) {
    throw new Error('每股销售收入必须大于0');
  }
  return price / salesPerShare;
}

/**
 * 使用市销率估值
 * @param salesPerShare 每股销售收入
 * @param industryPSRatio 行业平均市销率
 * @returns 估计股价
 */
export function valueByPSRatio(salesPerShare: number, industryPSRatio: number): number {
  if (industryPSRatio <= 0) {
    throw new Error('行业市销率必须大于0');
  }
  return salesPerShare * industryPSRatio;
}

/**
 * 计算企业价值倍数（EV/EBITDA）
 * @param enterpriseValue 企业价值
 * @param ebitda 息税折旧摊销前利润
 * @returns EV/EBITDA倍数
 */
export function calculateEVEBITDA(enterpriseValue: number, ebitda: number): number {
  if (ebitda <= 0) {
    throw new Error('EBITDA必须大于0');
  }
  return enterpriseValue / ebitda;
}

/**
 * 使用EV/EBITDA倍数估值
 * @param ebitda EBITDA
 * @param industryEVEBITDA 行业平均EV/EBITDA倍数
 * @param debt 债务
 * @param cash 现金
 * @param sharesOutstanding 流通股数量
 * @returns 估计股价
 */
export function valueByEVEBITDA(
  ebitda: number,
  industryEVEBITDA: number,
  debt: number,
  cash: number,
  sharesOutstanding: number
): number {
  if (industryEVEBITDA <= 0) {
    throw new Error('行业EV/EBITDA倍数必须大于0');
  }
  if (sharesOutstanding <= 0) {
    throw new Error('流通股数量必须大于0');
  }

  const enterpriseValue = ebitda * industryEVEBITDA;
  const equityValue = enterpriseValue - debt + cash;
  return equityValue / sharesOutstanding;
}

/**
 * 计算市盈增长比率（PEG Ratio）
 * @param peRatio 市盈率
 * @param growthRate 预期增长率（年化，小数形式）
 * @returns PEG比率
 */
export function calculatePEGRatio(peRatio: number, growthRate: number): number {
  if (growthRate <= 0) {
    throw new Error('增长率必须大于0');
  }
  return peRatio / (growthRate * 100); // 将增长率转换为百分比
}

/**
 * 计算企业价值（EV）
 * @param marketCap 市值
 * @param debt 债务
 * @param cash 现金及现金等价物
 * @param minorityInterest 少数股东权益
 * @returns 企业价值
 */
export function calculateEnterpriseValue(
  marketCap: number,
  debt: number,
  cash: number,
  minorityInterest: number = 0
): number {
  return marketCap + debt - cash + minorityInterest;
}
