'use client';

import React, { Suspense, ComponentType, ReactNode, lazy as reactLazy } from 'react';

/**
 * 懒加载组件的配置选项
 */
export interface LazyLoadOptions {
  /** 加载时的占位组件 */
  fallback?: ReactNode;
  /** 是否预加载组件 */
  preload?: boolean;
}

/**
 * 懒加载组件包装器
 *
 * @template P - 组件属性类型
 * @param importFn - 组件导入函数
 * @param options - 配置选项
 * @returns 懒加载的组件
 *
 * @example
 * ```tsx
 * const LazyComponent = lazyLoad(
 *   () => import('./HeavyComponent'),
 *   {
 *     fallback: <div>加载中...</div>
 *   }
 * );
 *
 * function App() {
 *   return <LazyComponent />;
 * }
 * ```
 */
export function lazyLoad<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
): ComponentType<P> {
  const { fallback, preload } = options;
  const LazyComponent = reactLazy(importFn);

  // 如果启用预加载，立即触发导入
  if (preload) {
    importFn();
  }

  const WrappedComponent: ComponentType<P> = (props: P) => {
    // 注意：错误边界需要在父组件中处理，这里只提供基本的懒加载
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = 'LazyLoad';

  return WrappedComponent;
}

/**
 * 默认加载占位组件
 */
function DefaultFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '200px',
      }}
    >
      <div>加载中...</div>
    </div>
  );
}

/**
 * 默认错误显示组件
 */
function DefaultErrorDisplay({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '200px',
      }}
    >
      <div style={{ marginBottom: '1rem', color: 'red' }}>
        加载组件时出错: {error.message}
      </div>
      <button
        onClick={retry}
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        重试
      </button>
    </div>
  );
}


/**
 * 延迟渲染组件 - 只在需要时渲染子组件
 *
 * @param children - 子组件
 * @param delay - 延迟时间（毫秒）
 * @param fallback - 延迟期间的占位组件
 *
 * @example
 * ```tsx
 * <DelayedRender delay={1000} fallback={<Spinner />}>
 *   <ExpensiveComponent />
 * </DelayedRender>
 * ```
 */
export function DelayedRender({
  children,
  delay = 0,
  fallback = null,
}: {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}) {
  const [shouldRender, setShouldRender] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

/**
 * 条件懒加载组件 - 根据条件决定是否懒加载
 *
 * @template P - 组件属性类型
 * @param importFn - 组件导入函数
 * @param shouldLoad - 是否应该加载组件
 * @param options - 配置选项
 * @returns 懒加载的组件或同步组件
 *
 * @example
 * ```tsx
 * const ConditionalComponent = conditionalLazyLoad(
 *   () => import('./HeavyComponent'),
 *   shouldLoadHeavyComponent,
 *   { fallback: <Loading /> }
 * );
 * ```
 */
export function conditionalLazyLoad<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  shouldLoad: boolean,
  options: LazyLoadOptions = {}
): ComponentType<P> {
  if (shouldLoad) {
    return lazyLoad(importFn, options);
  }

  // 如果不需要加载，返回一个占位组件
  const PlaceholderComponent = (props: P) => (
    <>{options.fallback || <DefaultFallback />}</>
  );
  return PlaceholderComponent as ComponentType<P>;
}
