/**
 * AWS Lambda函数集成
 * 提供函数调用、列表、配置管理等基础功能
 */

import {
  LambdaClient,
  InvokeCommand,
  ListFunctionsCommand,
  GetFunctionCommand,
  GetFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda';
import { getAWSConfig } from '../config';
import type { AWSConfig, LambdaInvokeOptions } from '../types';

/**
 * 创建Lambda客户端
 */
export function createLambdaClient(config?: Partial<AWSConfig>): LambdaClient {
  const awsConfig = getAWSConfig(config);
  return new LambdaClient({
    region: awsConfig.region,
    credentials: awsConfig.accessKeyId && awsConfig.secretAccessKey
      ? {
          accessKeyId: awsConfig.accessKeyId,
          secretAccessKey: awsConfig.secretAccessKey,
        }
      : undefined,
    endpoint: awsConfig.endpoint,
  });
}

/**
 * 调用Lambda函数
 */
export async function invokeLambda(
  client: LambdaClient,
  options: LambdaInvokeOptions
): Promise<{ statusCode?: number; payload?: string; error?: string }> {
  const command = new InvokeCommand({
    FunctionName: options.functionName,
    Payload: options.payload,
    InvocationType: options.invocationType || 'RequestResponse',
  });

  const response = await client.send(command);
  const payload = response.Payload
    ? new TextDecoder().decode(response.Payload)
    : undefined;

  return {
    statusCode: response.StatusCode,
    payload,
    error: response.FunctionError,
  };
}

/**
 * 列出所有Lambda函数
 */
export async function listLambdaFunctions(
  client: LambdaClient,
  maxItems?: number
): Promise<Array<{ functionName: string; runtime?: string; lastModified?: string }>> {
  const command = new ListFunctionsCommand({
    MaxItems: maxItems,
  });

  const response = await client.send(command);
  return (response.Functions || []).map((func: any) => ({
    functionName: func.FunctionName || '',
    runtime: func.Runtime,
    lastModified: func.LastModified?.toISOString(),
  }));
}

/**
 * 获取Lambda函数信息
 */
export async function getLambdaFunction(
  client: LambdaClient,
  functionName: string
): Promise<{
  functionName?: string;
  runtime?: string;
  handler?: string;
  codeSize?: number;
  lastModified?: string;
  timeout?: number;
  memorySize?: number;
} | null> {
  const command = new GetFunctionCommand({
    FunctionName: functionName,
  });

  try {
    const response = await client.send(command);
    const config = response.Configuration;
    return {
      functionName: config?.FunctionName,
      runtime: config?.Runtime,
      handler: config?.Handler,
      codeSize: config?.CodeSize,
      lastModified: config?.LastModified 
        ? (typeof (config.LastModified as any)?.toISOString === 'function'
            ? (config.LastModified as any).toISOString() 
            : typeof config.LastModified === 'string' 
            ? config.LastModified 
            : undefined)
        : undefined,
      timeout: config?.Timeout,
      memorySize: config?.MemorySize,
    };
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      return null;
    }
    throw error;
  }
}

/**
 * 获取Lambda函数配置
 */
export async function getLambdaFunctionConfig(
  client: LambdaClient,
  functionName: string
): Promise<{
  functionName?: string;
  runtime?: string;
  handler?: string;
  timeout?: number;
  memorySize?: number;
  environment?: Record<string, string>;
} | null> {
  const command = new GetFunctionConfigurationCommand({
    FunctionName: functionName,
  });

  try {
    const response = await client.send(command);
    return {
      functionName: response.FunctionName,
      runtime: response.Runtime,
      handler: response.Handler,
      timeout: response.Timeout,
      memorySize: response.MemorySize,
      environment: response.Environment?.Variables,
    };
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      return null;
    }
    throw error;
  }
}
