/**
 * 相关性和协方差计算
 */

/**
 * 计算两个数组的协方差
 * @param x 第一个数组
 * @param y 第二个数组
 * @returns 协方差
 */
export function calculateCovariance(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('两个数组长度必须一致');
  }
  if (x.length === 0) {
    throw new Error('数组不能为空');
  }

  const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
  const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;

  let covariance = 0;
  for (let i = 0; i < x.length; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
  }

  return covariance / (x.length - 1); // 样本协方差
}

/**
 * 计算两个数组的相关系数（Pearson相关系数）
 * @param x 第一个数组
 * @param y 第二个数组
 * @returns 相关系数（-1到1之间）
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('两个数组长度必须一致');
  }
  if (x.length === 0) {
    throw new Error('数组不能为空');
  }

  const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
  const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < x.length; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    sumSqX += diffX * diffX;
    sumSqY += diffY * diffY;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);
  if (denominator === 0) {
    return 0; // 避免除零
  }

  return numerator / denominator;
}

/**
 * 计算协方差矩阵
 * @param returnsMatrix 收益率矩阵（每行代表一个资产，每列代表一个时间点）
 * @returns 协方差矩阵（n×n，n为资产数量）
 */
export function calculateCovarianceMatrix(returnsMatrix: number[][]): number[][] {
  if (returnsMatrix.length === 0) {
    throw new Error('收益率矩阵不能为空');
  }

  const n = returnsMatrix.length; // 资产数量
  const covarianceMatrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    covarianceMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (returnsMatrix[i].length !== returnsMatrix[j].length) {
        throw new Error('所有资产的收益率数组长度必须一致');
      }
      covarianceMatrix[i][j] = calculateCovariance(returnsMatrix[i], returnsMatrix[j]);
    }
  }

  return covarianceMatrix;
}

/**
 * 计算相关系数矩阵
 * @param returnsMatrix 收益率矩阵（每行代表一个资产，每列代表一个时间点）
 * @returns 相关系数矩阵（n×n，n为资产数量）
 */
export function calculateCorrelationMatrix(returnsMatrix: number[][]): number[][] {
  if (returnsMatrix.length === 0) {
    throw new Error('收益率矩阵不能为空');
  }

  const n = returnsMatrix.length; // 资产数量
  const correlationMatrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (returnsMatrix[i].length !== returnsMatrix[j].length) {
        throw new Error('所有资产的收益率数组长度必须一致');
      }
      correlationMatrix[i][j] = calculateCorrelation(returnsMatrix[i], returnsMatrix[j]);
    }
  }

  return correlationMatrix;
}
