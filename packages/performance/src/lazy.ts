/**
 * 懒加载工具函数 - 延迟执行函数，直到第一次调用
 *
 * @template T - 返回值的类型
 * @param factory - 工厂函数，用于生成值
 * @returns 懒加载的值访问器
 *
 * @example
 * ```ts
 * const lazyValue = lazy(() => {
 *   console.log('计算中...');
 *   return expensiveComputation();
 * });
 *
 * // 此时还没有执行
 * const value = lazyValue(); // 现在才执行并返回结果
 * ```
 */
export function lazy<T>(factory: () => T): () => T {
  let value: T | undefined;
  let initialized = false;

  return () => {
    if (!initialized) {
      value = factory();
      initialized = true;
    }
    return value!;
  };
}

/**
 * 异步懒加载工具函数 - 延迟执行异步函数，直到第一次调用
 *
 * @template T - 返回值的类型
 * @param factory - 异步工厂函数，用于生成值
 * @returns 懒加载的异步值访问器
 *
 * @example
 * ```ts
 * const lazyAsyncValue = lazyAsync(async () => {
 *   const data = await fetch('/api/data');
 *   return data.json();
 * });
 *
 * const value = await lazyAsyncValue(); // 首次调用时才执行
 * const cached = await lazyAsyncValue(); // 返回缓存的值
 * ```
 */
export function lazyAsync<T>(factory: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | undefined;
  let cached: T | undefined;
  let resolved = false;

  return async () => {
    if (resolved && cached !== undefined) {
      return cached;
    }

    if (!promise) {
      promise = factory().then((result) => {
        cached = result;
        resolved = true;
        return result;
      });
    }

    return promise;
  };
}

/**
 * 图片懒加载工具 - 延迟加载图片直到需要显示
 *
 * @param src - 图片源地址
 * @returns Promise，解析为图片元素
 *
 * @example
 * ```ts
 * const imageLoader = lazyLoadImage('/path/to/image.jpg');
 * imageLoader.then(img => {
 *   document.body.appendChild(img);
 * });
 * ```
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 模块懒加载工具 - 动态导入模块
 *
 * @template T - 模块类型
 * @param moduleLoader - 模块加载函数
 * @returns 懒加载的模块访问器
 *
 * @example
 * ```ts
 * const lazyModule = lazyModule(() => import('./heavy-module'));
 * const module = await lazyModule(); // 首次调用时才加载模块
 * ```
 */
export function lazyModule<T>(
  moduleLoader: () => Promise<T>
): () => Promise<T> {
  let promise: Promise<T> | undefined;

  return async () => {
    if (!promise) {
      promise = moduleLoader();
    }
    return promise;
  };
}
