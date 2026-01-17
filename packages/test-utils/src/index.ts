// Mock 工具
export {
  createMockFunction,
  createAsyncMockFunction,
  createMockObject,
  spyOnMethod,
} from "./mocks";

// 工厂函数
export { createFactory, createMany } from "./factories";

// 自定义断言
export {
  expectArrayToContainEqual,
  expectObjectToContain,
  expectToBeInRange,
} from "./assertions";

// React 测试辅助
// 注意：renderWithProviders 和相关工具会导入 @testing-library/react
// 在 node 环境中使用会导致 navigator 错误
// 因此只导出类型，函数需要从 "./react" 单独导入
export type { TestProvider, RenderWithProvidersOptions } from "./react";

// 通用工具函数
export { waitFor, delay, timeout, retry } from "./utils";

// 导出 vitest 常用工具
export { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";

// React Testing Library 工具已移至 react-exports.ts
// 在 node 环境中不自动导出，避免 navigator 错误
// 如需使用，请从 "@fintech/test-utils/react" 导入
