import { vi, type MockedFunction } from "vitest";

/**
 * 创建类型安全的 mock 函数
 * @template T - 函数类型
 * @returns Mock 函数实例
 * @example
 * const mockFn = createMockFunction<(id: string) => string>();
 * mockFn.mockReturnValue("test");
 */
export function createMockFunction<T extends (...args: any[]) => any>(): MockedFunction<T> {
  return vi.fn() as unknown as MockedFunction<T>;
}

/**
 * 创建异步 mock 函数
 * @template T - 异步函数类型
 * @returns 异步 Mock 函数实例
 * @example
 * const mockAsyncFn = createAsyncMockFunction<(id: string) => Promise<string>>();
 * mockAsyncFn.mockResolvedValue("test");
 */
export function createAsyncMockFunction<T extends (...args: any[]) => Promise<any>>(): MockedFunction<T> {
  return vi.fn() as unknown as MockedFunction<T>;
}

/**
 * 创建 mock 对象
 * @template T - 对象类型
 * @param partial - 部分属性实现
 * @returns Mock 对象
 * @example
 * const mockApi = createMockObject<ApiClient>({
 *   get: createMockFunction(),
 *   post: createAsyncMockFunction(),
 * });
 */
export function createMockObject<T extends Record<string, any>>(
  partial: Partial<{ [K in keyof T]: T[K] }> = {}
): T {
  return partial as T;
}

/**
 * 对对象方法进行 spy
 * @template T - 对象类型
 * @param obj - 要 spy 的对象
 * @param methodName - 方法名
 * @returns Spy 函数
 * @example
 * const spy = spyOnMethod(apiClient, "getDevice");
 * expect(spy).toHaveBeenCalled();
 */
export function spyOnMethod<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  methodName: K
): T[K] extends (...args: any[]) => any ? MockedFunction<T[K]> : never {
  return vi.spyOn(obj, methodName as string) as any;
}
