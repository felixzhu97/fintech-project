/**
 * 回归分析
 */

/**
 * 简单线性回归结果
 */
export interface SimpleLinearRegressionResult {
  intercept: number; // 截距
  slope: number; // 斜率
  rSquared: number; // R²（决定系数）
  standardError: number; // 标准误差
}

/**
 * 多元线性回归结果
 */
export interface MultipleLinearRegressionResult {
  intercept: number; // 截距
  coefficients: number[]; // 系数数组
  rSquared: number; // R²（决定系数）
  adjustedRSquared: number; // 调整后的R²
}

/**
 * 简单线性回归（一元线性回归）
 * y = a + bx
 * @param x 自变量数组
 * @param y 因变量数组
 * @returns 回归结果
 */
export function simpleLinearRegression(
  x: number[],
  y: number[]
): SimpleLinearRegressionResult {
  if (x.length !== y.length) {
    throw new Error('自变量和因变量数组长度必须一致');
  }
  if (x.length < 2) {
    throw new Error('至少需要2个数据点进行回归');
  }

  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = y.reduce((sum, val) => sum + val * val, 0);

  // 计算斜率 b = (nΣxy - ΣxΣy) / (nΣx² - (Σx)²)
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) {
    throw new Error('自变量方差为0，无法进行回归');
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;

  // 计算截距 a = (Σy - bΣx) / n
  const intercept = (sumY - slope * sumX) / n;

  // 计算R²
  const yMean = sumY / n;
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * x[i];
    ssTotal += Math.pow(y[i] - yMean, 2);
    ssResidual += Math.pow(y[i] - predicted, 2);
  }

  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  // 计算标准误差
  const standardError = Math.sqrt(ssResidual / (n - 2));

  return {
    intercept,
    slope,
    rSquared: Math.max(0, Math.min(1, rSquared)),
    standardError,
  };
}

/**
 * 多元线性回归
 * y = a + b1x1 + b2x2 + ... + bnxn
 * @param y 因变量数组
 * @param x 自变量矩阵（每行代表一个自变量，每列代表一个观测值）
 * @returns 回归结果
 */
export function multipleLinearRegression(
  y: number[],
  x: number[][]
): MultipleLinearRegressionResult {
  if (x.length === 0) {
    throw new Error('自变量矩阵不能为空');
  }
  if (y.length !== x[0].length) {
    throw new Error('因变量数组长度必须与自变量矩阵的列数一致');
  }
  if (y.length < x.length + 1) {
    throw new Error('观测值数量必须大于自变量数量');
  }

  const n = y.length;
  const k = x.length; // 自变量数量

  // 构建设计矩阵 X（包含截距项）
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    X[i] = [1, ...x.map((col) => col[i])];
  }

  // 使用正规方程求解：β = (X'X)^(-1)X'y
  const coefficients = solveNormalEquation(X, y);

  // 计算R²和调整后的R²
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = coefficients[0] + coefficients.slice(1).reduce((sum, coef, j) => sum + coef * x[j][i], 0);
    ssTotal += Math.pow(y[i] - yMean, 2);
    ssResidual += Math.pow(y[i] - predicted, 2);
  }

  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;
  const adjustedRSquared = 1 - (1 - rSquared) * ((n - 1) / (n - k - 1));

  return {
    intercept: coefficients[0],
    coefficients: coefficients.slice(1),
    rSquared: Math.max(0, Math.min(1, rSquared)),
    adjustedRSquared: Math.max(0, Math.min(1, adjustedRSquared)),
  };
}

/**
 * 求解正规方程（辅助函数）
 */
function solveNormalEquation(X: number[][], y: number[]): number[] {
  const n = X.length;
  const k = X[0].length;

  // 计算 X'X
  const XTX: number[][] = [];
  for (let i = 0; i < k; i++) {
    XTX[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }

  // 计算 X'y
  const XTy: number[] = [];
  for (let i = 0; i < k; i++) {
    let sum = 0;
    for (let m = 0; m < n; m++) {
      sum += X[m][i] * y[m];
    }
    XTy[i] = sum;
  }

  // 求解线性方程组
  return gaussianElimination(XTX, XTy);
}

/**
 * 高斯消元法求解线性方程组（辅助函数）
 */
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented: number[][] = A.map((row, i) => [...row, b[i]]);

  // 前向消元
  for (let i = 0; i < n; i++) {
    // 寻找主元
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // 消元
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[i][i]) < 1e-10) {
        throw new Error('矩阵奇异，无法求解');
      }
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j < n + 1; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // 回代
  const x: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    if (Math.abs(augmented[i][i]) < 1e-10) {
      throw new Error('矩阵奇异，无法求解');
    }
    x[i] /= augmented[i][i];
  }

  return x;
}
