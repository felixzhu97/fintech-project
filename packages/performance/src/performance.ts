/**
 * 性能指标类型
 */
export interface PerformanceMetrics {
  /** 执行时间（毫秒） */
  duration: number;
  /** 开始时间戳 */
  startTime: number;
  /** 结束时间戳 */
  endTime: number;
  /** 附加信息 */
  metadata?: Record<string, unknown>;
}

/**
 * 性能指标收集器
 */
export class PerformanceCollector {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();

  /**
   * 记录性能指标
   *
   * @param name - 指标名称
   * @param metrics - 性能指标
   */
  record(name: string, metrics: PerformanceMetrics): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metrics);
  }

  /**
   * 获取指定指标的所有记录
   *
   * @param name - 指标名称
   * @returns 性能指标数组
   */
  get(name: string): PerformanceMetrics[] {
    return this.metrics.get(name) || [];
  }

  /**
   * 获取所有指标名称
   *
   * @returns 指标名称数组
   */
  getNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * 获取指定指标的统计信息
   *
   * @param name - 指标名称
   * @returns 统计信息
   */
  getStats(name: string): {
    count: number;
    total: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const records = this.get(name);
    if (records.length === 0) {
      return null;
    }

    const durations = records.map((r) => r.duration);
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      count: records.length,
      total,
      average: total / records.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }

  /**
   * 清空所有指标
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * 清空指定指标的记录
   *
   * @param name - 指标名称
   */
  clearMetric(name: string): void {
    this.metrics.delete(name);
  }
}

/**
 * 全局性能指标收集器实例
 */
export const globalPerformanceCollector = new PerformanceCollector();

/**
 * 测量函数执行时间
 *
 * @template T - 函数返回类型
 * @param fn - 要测量的函数
 * @param label - 可选的标签，用于标识测量
 * @returns 函数执行结果和执行时间（毫秒）
 *
 * @example
 * ```ts
 * const [result, duration] = measure(() => {
 *   return expensiveComputation();
 * }, 'computation');
 *
 * console.log(`执行时间: ${duration}ms`);
 * ```
 */
export function measure<T>(
  fn: () => T,
  label?: string
): [T, number] {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (label) {
    globalPerformanceCollector.record(label, {
      duration,
      startTime,
      endTime,
    });
  }

  return [result, duration];
}

/**
 * 异步测量函数执行时间
 *
 * @template T - Promise 返回类型
 * @param fn - 要测量的异步函数
 * @param label - 可选的标签，用于标识测量
 * @returns Promise，解析为函数执行结果和执行时间（毫秒）
 *
 * @example
 * ```ts
 * const [result, duration] = await measureAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * }, 'fetch');
 *
 * console.log(`执行时间: ${duration}ms`);
 * ```
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<[T, number]> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (label) {
    globalPerformanceCollector.record(label, {
      duration,
      startTime,
      endTime,
    });
  }

  return [result, duration];
}

/**
 * 创建性能标记器
 *
 * @param name - 标记名称
 * @returns 标记器对象，包含 start 和 end 方法
 *
 * @example
 * ```ts
 * const marker = createMarker('render');
 * marker.start();
 * // ... 执行操作
 * const duration = marker.end();
 * console.log(`耗时: ${duration}ms`);
 * ```
 */
export function createMarker(name?: string): {
  start: () => void;
  end: () => number | null;
} {
  let startTime: number | null = null;

  return {
    start: () => {
      startTime = performance.now();
      if (name) {
        performance.mark(`${name}-start`);
      }
    },
    end: () => {
      if (startTime === null) {
        console.warn('Marker was not started before calling end()');
        return null;
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }

      startTime = null;
      return duration;
    },
  };
}

/**
 * 使用装饰器模式测量方法执行时间
 *
 * @param label - 可选的标签，用于标识测量
 * @returns 装饰器函数
 *
 * @example
 * ```ts
 * class MyClass {
 *   @measured('myMethod')
 *   myMethod() {
 *     // ... 方法实现
 *   }
 * }
 * ```
 */
export function measured(label?: string) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = function (this: any, ...args: Parameters<T>) {
      const methodLabel = label || `${target.constructor.name}.${propertyKey}`;
      const [result] = measure(() => originalMethod.apply(this, args), methodLabel);
      return result;
    } as T;

    return descriptor;
  };
}

/**
 * 异步方法执行时间测量装饰器
 *
 * @param label - 可选的标签，用于标识测量
 * @returns 装饰器函数
 *
 * @example
 * ```ts
 * class MyClass {
 *   @measuredAsync('fetchData')
 *   async fetchData() {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   }
 * }
 * ```
 */
export function measuredAsync(label?: string) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (this: any, ...args: Parameters<T>) {
      const methodLabel = label || `${target.constructor.name}.${propertyKey}`;
      const [result] = await measureAsync(
        () => originalMethod.apply(this, args),
        methodLabel
      );
      return result;
    } as T;

    return descriptor;
  };
}

/**
 * 批量测量多个函数的执行时间
 *
 * @template T - 函数返回类型
 * @param fns - 要测量的函数数组
 * @param labels - 可选的标签数组
 * @returns 执行结果和执行时间的数组
 *
 * @example
 * ```ts
 * const results = measureBatch([
 *   () => computation1(),
 *   () => computation2(),
 * ], ['comp1', 'comp2']);
 *
 * results.forEach(([result, duration], index) => {
 *   console.log(`函数 ${index} 耗时: ${duration}ms`);
 * });
 * ```
 */
export function measureBatch<T>(
  fns: Array<() => T>,
  labels?: string[]
): Array<[T, number]> {
  return fns.map((fn, index) => {
    const label = labels?.[index];
    return measure(fn, label);
  });
}

/**
 * 批量测量多个异步函数的执行时间
 *
 * @template T - Promise 返回类型
 * @param fns - 要测量的异步函数数组
 * @param labels - 可选的标签数组
 * @returns Promise，解析为执行结果和执行时间的数组
 *
 * @example
 * ```ts
 * const results = await measureBatchAsync([
 *   async () => fetchData1(),
 *   async () => fetchData2(),
 * ], ['fetch1', 'fetch2']);
 * ```
 */
export async function measureBatchAsync<T>(
  fns: Array<() => Promise<T>>,
  labels?: string[]
): Promise<Array<[T, number]>> {
  return Promise.all(
    fns.map((fn, index) => {
      const label = labels?.[index];
      return measureAsync(fn, label);
    })
  );
}

/**
 * 获取内存使用情况（如果可用）
 *
 * @returns 内存使用信息，如果不可用则返回 null
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if (
    typeof performance !== 'undefined' &&
    'memory' in performance &&
    (performance as any).memory
  ) {
    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize;
    const total = memory.totalJSHeapSize;

    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  }

  return null;
}
