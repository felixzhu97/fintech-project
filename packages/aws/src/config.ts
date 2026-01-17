/**
 * AWS配置工具
 * 支持从环境变量读取AWS凭证和配置
 */

import type { AWSConfig } from './types';

/**
 * 获取AWS配置
 * 优先使用传入的配置，其次从环境变量读取
 */
export function getAWSConfig(config?: Partial<AWSConfig>): AWSConfig {
  return {
    region: config?.region || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
    accessKeyId: config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: config?.endpoint || process.env.AWS_ENDPOINT_URL,
  };
}
