/**
 * 约束条件处理
 */

/**
 * 权重约束接口
 */
export interface WeightConstraints {
  min?: number[];
  max?: number[];
  longOnly?: boolean; // 是否只允许做多（权重非负）
  maxWeight?: number; // 单个资产最大权重
  minWeight?: number; // 单个资产最小权重
}

/**
 * 检查权重是否满足约束条件
 * @param weights 权重数组
 * @param constraints 约束条件
 * @returns 是否满足约束
 */
export function checkWeightConstraints(
  weights: number[],
  constraints: WeightConstraints
): boolean {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.01) {
    return false; // 权重总和必须约等于1
  }

  if (constraints.longOnly) {
    // 只允许做多
    if (weights.some((w) => w < 0)) {
      return false;
    }
  }

  if (constraints.minWeight !== undefined) {
    if (weights.some((w) => w < constraints.minWeight!)) {
      return false;
    }
  }

  if (constraints.maxWeight !== undefined) {
    if (weights.some((w) => w > constraints.maxWeight!)) {
      return false;
    }
  }

  if (constraints.min) {
    if (weights.length !== constraints.min.length) {
      return false;
    }
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] < constraints.min[i]) {
        return false;
      }
    }
  }

  if (constraints.max) {
    if (weights.length !== constraints.max.length) {
      return false;
    }
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > constraints.max[i]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 归一化权重数组，使其总和为1
 * @param weights 权重数组
 * @returns 归一化后的权重数组
 */
export function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) {
    throw new Error('权重总和不能为0');
  }
  return weights.map((w) => w / sum);
}

/**
 * 将权重数组裁剪到指定范围内
 * @param weights 权重数组
 * @param min 最小值，默认0
 * @param max 最大值，默认1
 * @returns 裁剪后的权重数组（已归一化）
 */
export function clipWeights(
  weights: number[],
  min: number = 0,
  max: number = 1
): number[] {
  const clipped = weights.map((w) => Math.max(min, Math.min(max, w)));
  return normalizeWeights(clipped);
}
