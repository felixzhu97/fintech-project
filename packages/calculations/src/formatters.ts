/**
 * 格式化工具函数
 */

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币代码，默认为 'CNY'
 * @param locale 语言环境，默认为 'zh-CN'
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * 格式化百分比
 * @param value 数值（小数形式，例如 0.15 表示 15%）
 * @param decimals 小数位数，默认为 2
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * 格式化数字
 * @param value 数值
 * @param decimals 小数位数，默认为 2
 * @returns 格式化后的数字字符串
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * 格式化大数字（添加千位分隔符）
 * @param value 数值
 * @param decimals 小数位数，默认为 2
 * @param locale 语言环境，默认为 'zh-CN'
 * @returns 格式化后的数字字符串
 */
export function formatLargeNumber(
  value: number,
  decimals: number = 2,
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 格式化简写数字（例如：1.5K, 1.2M）
 * @param value 数值
 * @param decimals 小数位数，默认为 1
 * @returns 格式化后的简写数字字符串
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  }
  return `${sign}${absValue.toFixed(decimals)}`;
}
