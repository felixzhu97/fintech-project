/**
 * Fama-French因子模型
 */

/**
 * Fama-French三因子模型结果
 */
export interface FamaFrench3FactorResult {
  alpha: number; // Alpha（超额收益）
  beta: number; // 市场因子载荷
  smb: number; // 小盘股因子载荷（Small Minus Big）
  hml: number; // 价值因子载荷（High Minus Low）
  rSquared: number; // R²（拟合优度）
}

/**
 * Fama-French五因子模型结果
 */
export interface FamaFrench5FactorResult {
  alpha: number; // Alpha（超额收益）
  beta: number; // 市场因子载荷
  smb: number; // 小盘股因子载荷
  hml: number; // 价值因子载荷
  rmw: number; // 盈利能力因子载荷（Robust Minus Weak）
  cma: number; // 投资风格因子载荷（Conservative Minus Aggressive）
  rSquared: number; // R²（拟合优度）
}

/**
 * 使用Fama-French三因子模型进行回归分析
 * @param stockReturns 股票收益率数组（超额收益，即股票收益 - 无风险利率）
 * @param marketReturns 市场收益率数组（超额收益）
 * @param smbReturns 小盘股因子收益率数组
 * @param hmlReturns 价值因子收益率数组
 * @returns Fama-French三因子模型结果
 */
export function calculateFamaFrench3Factor(
  stockReturns: number[],
  marketReturns: number[],
  smbReturns: number[],
  hmlReturns: number[]
): FamaFrench3FactorResult {
  if (
    stockReturns.length !== marketReturns.length ||
    stockReturns.length !== smbReturns.length ||
    stockReturns.length !== hmlReturns.length
  ) {
    throw new Error('所有收益率数组长度必须一致');
  }
  if (stockReturns.length < 4) {
    throw new Error('至少需要4个数据点进行回归分析');
  }

  // 使用最小二乘法进行多元线性回归
  // Ri - Rf = α + β(Rm - Rf) + sSMB + hHML + ε
  const result = multipleLinearRegression(
    stockReturns,
    [marketReturns, smbReturns, hmlReturns]
  );

  return {
    alpha: result.intercept,
    beta: result.coefficients[0],
    smb: result.coefficients[1],
    hml: result.coefficients[2],
    rSquared: result.rSquared,
  };
}

/**
 * 使用Fama-French五因子模型进行回归分析
 * @param stockReturns 股票收益率数组（超额收益）
 * @param marketReturns 市场收益率数组（超额收益）
 * @param smbReturns 小盘股因子收益率数组
 * @param hmlReturns 价值因子收益率数组
 * @param rmwReturns 盈利能力因子收益率数组
 * @param cmaReturns 投资风格因子收益率数组
 * @returns Fama-French五因子模型结果
 */
export function calculateFamaFrench5Factor(
  stockReturns: number[],
  marketReturns: number[],
  smbReturns: number[],
  hmlReturns: number[],
  rmwReturns: number[],
  cmaReturns: number[]
): FamaFrench5FactorResult {
  if (
    stockReturns.length !== marketReturns.length ||
    stockReturns.length !== smbReturns.length ||
    stockReturns.length !== hmlReturns.length ||
    stockReturns.length !== rmwReturns.length ||
    stockReturns.length !== cmaReturns.length
  ) {
    throw new Error('所有收益率数组长度必须一致');
  }
  if (stockReturns.length < 6) {
    throw new Error('至少需要6个数据点进行回归分析');
  }

  // 使用最小二乘法进行多元线性回归
  const result = multipleLinearRegression(stockReturns, [
    marketReturns,
    smbReturns,
    hmlReturns,
    rmwReturns,
    cmaReturns,
  ]);

  return {
    alpha: result.intercept,
    beta: result.coefficients[0],
    smb: result.coefficients[1],
    hml: result.coefficients[2],
    rmw: result.coefficients[3],
    cma: result.coefficients[4],
    rSquared: result.rSquared,
  };
}

/**
 * 多元线性回归结果
 */
interface RegressionResult {
  intercept: number;
  coefficients: number[];
  rSquared: number;
}

/**
 * 多元线性回归（简化实现，使用最小二乘法）
 * 注意：这是一个简化实现，实际应用中应使用更稳健的数值方法
 */
function multipleLinearRegression(
  y: number[],
  x: number[][]
): RegressionResult {
  const n = y.length;
  const k = x.length; // 自变量数量

  // 构建设计矩阵 X（包含截距项）
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    X[i] = [1, ...x.map((col) => col[i])];
  }

  // 使用正规方程求解：β = (X'X)^(-1)X'y
  // 这里使用简化方法，实际应使用矩阵求逆
  const coefficients = solveNormalEquation(X, y);

  // 计算R²
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = coefficients[0] + coefficients.slice(1).reduce((sum, coef, j) => sum + coef * x[j][i], 0);
    ssTotal += Math.pow(y[i] - yMean, 2);
    ssResidual += Math.pow(y[i] - predicted, 2);
  }

  const rSquared = 1 - ssResidual / ssTotal;

  return {
    intercept: coefficients[0],
    coefficients: coefficients.slice(1),
    rSquared: Math.max(0, Math.min(1, rSquared)), // 确保R²在0-1之间
  };
}

/**
 * 求解正规方程（简化实现）
 * 注意：这是一个简化实现，实际应使用更稳健的数值方法（如SVD）
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

  // 求解线性方程组 XTX * β = XTy
  // 使用高斯消元法（简化实现）
  return gaussianElimination(XTX, XTy);
}

/**
 * 高斯消元法求解线性方程组（简化实现）
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
    x[i] /= augmented[i][i];
  }

  return x;
}
