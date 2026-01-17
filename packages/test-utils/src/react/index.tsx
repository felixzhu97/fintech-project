import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

/**
 * Provider 组件的类型定义
 */
export type TestProvider = ({ children }: { children: React.ReactNode }) => ReactElement;

/**
 * 带 Provider 的组件渲染配置
 */
export interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  providers?: TestProvider[];
}

/**
 * 带 Provider 的组件渲染
 * @param ui - 要渲染的组件
 * @param options - 渲染选项，可指定多个 Provider
 * @returns 渲染结果
 * @example
 * const { container } = renderWithProviders(<Component />, {
 *   providers: [ThemeProvider, QueryProvider],
 * });
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
): ReturnType<typeof render> {
  const { providers = [], ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      <>{children}</>
    );
  };

  return render(ui, { ...renderOptions, wrapper: Wrapper });
}
