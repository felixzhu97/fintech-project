/**
 * 防抖函数 - 在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
 *
 * @template T - 函数类型
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @param immediate - 是否立即执行（默认 false）
 * @returns 防抖后的函数
 *
 * @example
 * ```ts
 * const debouncedFn = debounce((value: string) => {
 *   console.log(value);
 * }, 300);
 *
 * debouncedFn('hello'); // 不会立即执行
 * debouncedFn('world'); // 取消之前的调用
 * // 300ms 后只会执行一次，参数为 'world'
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isImmediateCalled = false;

  return function debounced(...args: Parameters<T>) {
    const callNow = immediate && !isImmediateCalled;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate || isImmediateCalled) {
        fn(...args);
      }
      isImmediateCalled = false;
    }, delay);

    if (callNow) {
      isImmediateCalled = true;
      fn(...args);
    }
  };
}

/**
 * 带取消功能的防抖函数
 *
 * @template T - 函数类型
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @param immediate - 是否立即执行（默认 false）
 * @returns 包含防抖函数和取消方法的对象
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate = false
): {
  cancel: () => void;
  flush: () => void;
  debounced: (...args: Parameters<T>) => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isImmediateCalled = false;
  let lastArgs: Parameters<T> | null = null;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    isImmediateCalled = false;
    lastArgs = null;
  };

  const flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      timeoutId = null;
      fn(...lastArgs);
    }
    isImmediateCalled = false;
    lastArgs = null;
  };

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    const callNow = immediate && !isImmediateCalled;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate || isImmediateCalled) {
        if (lastArgs) {
          fn(...lastArgs);
        }
      }
      isImmediateCalled = false;
      lastArgs = null;
    }, delay);

    if (callNow) {
      isImmediateCalled = true;
      fn(...args);
    }
  };

  return {
    cancel,
    flush,
    debounced,
  };
}
