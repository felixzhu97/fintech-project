/**
 * 节流函数 - 在 n 秒内最多执行一次函数
 *
 * @template T - 函数类型
 * @param fn - 要节流的函数
 * @param delay - 节流间隔（毫秒）
 * @param options - 选项
 * @param options.leading - 是否在开始时执行（默认 true）
 * @param options.trailing - 是否在结束时执行（默认 true）
 * @returns 节流后的函数
 *
 * @example
 * ```ts
 * const throttledFn = throttle((value: string) => {
 *   console.log(value);
 * }, 300);
 *
 * throttledFn('hello'); // 立即执行
 * throttledFn('world'); // 被忽略
 * throttledFn('test');  // 被忽略
 * // 300ms 后可能会执行最后一次调用
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    const currentTime = Date.now();
    lastArgs = args;

    if (leading && currentTime - lastExecTime >= delay) {
      fn(...args);
      lastExecTime = currentTime;
      lastArgs = null;
    } else if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (lastArgs && trailing) {
          fn(...lastArgs);
          lastExecTime = Date.now();
          lastArgs = null;
        }
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * 带取消功能的节流函数
 *
 * @template T - 函数类型
 * @param fn - 要节流的函数
 * @param delay - 节流间隔（毫秒）
 * @param options - 选项
 * @param options.leading - 是否在开始时执行（默认 true）
 * @param options.trailing - 是否在结束时执行（默认 true）
 * @returns 包含节流函数和取消方法的对象
 */
export function throttleWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): {
  cancel: () => void;
  flush: () => void;
  throttled: (...args: Parameters<T>) => void;
} {
  const { leading = true, trailing = true } = options;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  const flush = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
    cancel();
  };

  const throttled = (...args: Parameters<T>) => {
    const currentTime = Date.now();
    lastArgs = args;

    if (leading && currentTime - lastExecTime >= delay) {
      fn(...args);
      lastExecTime = currentTime;
      lastArgs = null;
    } else if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (lastArgs && trailing) {
          fn(...lastArgs);
          lastExecTime = Date.now();
          lastArgs = null;
        }
      }, delay - (currentTime - lastExecTime));
    }
  };

  return {
    cancel,
    flush,
    throttled,
  };
}
