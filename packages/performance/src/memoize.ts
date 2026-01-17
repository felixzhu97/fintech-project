/**
 * 记忆化函数 - 缓存函数结果，避免重复计算
 *
 * @template T - 函数类型
 * @param fn - 要记忆化的函数
 * @param keyGenerator - 可选的键生成函数，用于生成缓存键（默认使用 JSON.stringify）
 * @returns 记忆化后的函数
 *
 * @example
 * ```ts
 * const expensiveFn = memoize((n: number) => {
 *   console.log('计算中...', n);
 *   return n * 2;
 * });
 *
 * expensiveFn(5); // 计算并缓存
 * expensiveFn(5); // 从缓存返回，不重新计算
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  const generateKey = keyGenerator || ((...args: Parameters<T>) => {
    try {
      return JSON.stringify(args);
    } catch {
      // 如果无法序列化，使用默认的字符串表示
      return String(args);
    }
  });

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = generateKey(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * 带大小限制的记忆化函数 - 使用 LRU 缓存策略
 *
 * @template T - 函数类型
 * @param fn - 要记忆化的函数
 * @param maxSize - 缓存的最大条目数
 * @param keyGenerator - 可选的键生成函数
 * @returns 记忆化后的函数和缓存控制对象
 *
 * @example
 * ```ts
 * const { memoized, clear, size } = memoizeWithLimit(
 *   (n: number) => n * 2,
 *   10
 * );
 *
 * memoized(5);
 * console.log(size()); // 1
 * clear(); // 清空缓存
 * ```
 */
export function memoizeWithLimit<T extends (...args: any[]) => any>(
  fn: T,
  maxSize: number,
  keyGenerator?: (...args: Parameters<T>) => string
): {
  memoized: (...args: Parameters<T>) => ReturnType<T>;
  clear: () => void;
  size: () => number;
} {
  const cache = new Map<string, ReturnType<T>>();
  const accessOrder: string[] = [];

  const generateKey = keyGenerator || ((...args: Parameters<T>) => {
    try {
      return JSON.stringify(args);
    } catch {
      return String(args);
    }
  });

  const get = (key: string): ReturnType<T> | undefined => {
    if (cache.has(key)) {
      // 更新访问顺序
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
      accessOrder.push(key);
      return cache.get(key);
    }
    return undefined;
  };

  const set = (key: string, value: ReturnType<T>): void => {
    if (cache.has(key)) {
      cache.set(key, value);
      // 更新访问顺序
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
      accessOrder.push(key);
    } else {
      // 如果缓存已满，删除最旧的项
      if (cache.size >= maxSize && accessOrder.length > 0) {
        const oldestKey = accessOrder.shift()!;
        cache.delete(oldestKey);
      }
      cache.set(key, value);
      accessOrder.push(key);
    }
  };

  const memoized = (...args: Parameters<T>): ReturnType<T> => {
    const key = generateKey(...args);

    const cached = get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    set(key, result);
    return result;
  };

  const clear = (): void => {
    cache.clear();
    accessOrder.length = 0;
  };

  const size = (): number => cache.size;

  return {
    memoized,
    clear,
    size,
  };
}

/**
 * 异步函数记忆化 - 缓存异步函数的结果
 *
 * @template T - 函数类型
 * @param fn - 要记忆化的异步函数
 * @param keyGenerator - 可选的键生成函数
 * @returns 记忆化后的异步函数
 *
 * @example
 * ```ts
 * const memoizedFetch = memoizeAsync(async (url: string) => {
 *   const response = await fetch(url);
 *   return response.json();
 * });
 *
 * const data1 = await memoizedFetch('/api/data'); // 执行请求
 * const data2 = await memoizedFetch('/api/data'); // 返回缓存的结果
 * ```
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const cache = new Map<string, ReturnType<T>>();

  const generateKey = keyGenerator || ((...args: Parameters<T>) => {
    try {
      return JSON.stringify(args);
    } catch {
      return String(args);
    }
  });

  return async function memoized(...args: Parameters<T>): Promise<ReturnType<T>> {
    const key = generateKey(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * 弱引用记忆化 - 使用 WeakMap 进行记忆化（适用于对象作为参数）
 *
 * @template T - 函数类型
 * @param fn - 要记忆化的函数
 * @returns 记忆化后的函数
 *
 * @example
 * ```ts
 * const memoized = memoizeWeak((obj: { value: number }) => {
 *   return obj.value * 2;
 * });
 *
 * const obj = { value: 5 };
 * memoized(obj); // 计算并缓存
 * memoized(obj); // 从缓存返回
 * ```
 */
export function memoizeWeak<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new WeakMap<object, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    // WeakMap 只接受对象作为键，这里取第一个参数
    if (args.length === 0 || typeof args[0] !== 'object' || args[0] === null) {
      // 如果第一个参数不是对象，直接执行函数
      return fn(...args);
    }

    const key = args[0] as object;

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
