import { waitFor as vitestWaitFor } from "@testing-library/react";

/**
 * 等待条件满足
 * @param condition - 条件函数
 * @param options - 配置选项
 * @example
 * await waitFor(() => {
 *   expect(element).toBeInTheDocument();
 * }, { timeout: 5000 });
 */
export function waitFor<T>(
  condition: () => T | Promise<T>,
  options?: { timeout?: number; interval?: number }
): Promise<T> {
  return vitestWaitFor(condition, options);
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 * @returns Promise
 * @example
 * await delay(1000);
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 带超时的 Promise
 * @param promise - 要执行的 Promise
 * @param timeoutMs - 超时毫秒数
 * @param errorMessage - 超时错误消息
 * @returns Promise 结果
 * @example
 * const result = await timeout(fetchData(), 5000, "Timeout error");
 */
export async function timeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Operation timed out"
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * 重试逻辑
 * @param fn - 要执行的函数
 * @param options - 重试配置
 * @returns Promise 结果
 * @example
 * const result = await retry(() => fetchData(), {
 *   maxAttempts: 3,
 *   delay: 1000,
 * });
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay: delayMs = 1000, onRetry } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxAttempts) {
        onRetry?.(lastError, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}
