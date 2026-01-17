import { expect } from "vitest";

/**
 * 断言数组包含相等的元素（忽略顺序）
 * @param actual - 实际数组
 * @param expectedItem - 期望包含的元素
 * @example
 * expectArrayToContainEqual([1, 2, 3], 2);
 */
export function expectArrayToContainEqual<T>(actual: T[], expectedItem: T): void {
  expect(actual).toContainEqual(expectedItem);
}

/**
 * 断言对象包含指定属性
 * @param actual - 实际对象
 * @param expected - 期望包含的属性
 * @example
 * expectObjectToContain({ a: 1, b: 2 }, { a: 1 });
 */
export function expectObjectToContain<T extends Record<string, any>>(
  actual: T,
  expected: Partial<T>
): void {
  expect(actual).toMatchObject(expected);
}

/**
 * 断言数值在指定范围内
 * @param value - 实际值
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @example
 * expectToBeInRange(50, 0, 100);
 */
export function expectToBeInRange(value: number, min: number, max: number): void {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}
