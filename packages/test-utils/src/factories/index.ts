/**
 * 工厂函数创建器
 * @template T - 数据类型
 * @param factoryFn - 工厂函数
 * @returns 工厂函数，支持部分覆盖
 * @example
 * const deviceFactory = createFactory(() => ({
 *   id: "default-id",
 *   name: "Default Device",
 *   status: "online",
 * }));
 * const device = deviceFactory({ name: "Custom Device" });
 */
export function createFactory<T extends Record<string, any>>(
  factoryFn: () => T
): (overrides?: Partial<T>) => T {
  return (overrides?: Partial<T>) => {
    return { ...factoryFn(), ...overrides };
  };
}

/**
 * 批量生成测试数据
 * @template T - 数据类型
 * @param factory - 工厂函数
 * @param count - 生成数量
 * @param overrides - 可选的整体覆盖或数组索引覆盖
 * @returns 生成的数据数组
 * @example
 * const devices = createMany(deviceFactory, 5);
 * const customDevices = createMany(deviceFactory, 3, { status: "offline" });
 */
export function createMany<T extends Record<string, any>>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overrides?: Partial<T> | ((index: number) => Partial<T>)
): T[] {
  return Array.from({ length: count }, (_, index) => {
    const indexOverrides = typeof overrides === "function" ? overrides(index) : overrides;
    return factory(indexOverrides);
  });
}
