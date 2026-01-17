/**
 * AWS API Gateway集成
 * 提供WebSocket连接管理等基础功能
 */

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
  GetConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  ApiGatewayV2Client,
  CreateApiCommand,
  GetApiCommand,
  CreateRouteCommand,
  CreateIntegrationCommand,
} from '@aws-sdk/client-apigatewayv2';
import { getAWSConfig } from '../config';
import type { AWSConfig } from '../types';

/**
 * 创建API Gateway Management API客户端（用于WebSocket）
 */
export function createAPIGatewayManagementClient(
  endpoint: string,
  config?: Partial<AWSConfig>
): ApiGatewayManagementApiClient {
  const awsConfig = getAWSConfig(config);
  return new ApiGatewayManagementApiClient({
    region: awsConfig.region,
    credentials: awsConfig.accessKeyId && awsConfig.secretAccessKey
      ? {
          accessKeyId: awsConfig.accessKeyId,
          secretAccessKey: awsConfig.secretAccessKey,
        }
      : undefined,
    endpoint,
  });
}

/**
 * 创建API Gateway V2客户端
 */
export function createAPIGatewayV2Client(config?: Partial<AWSConfig>): ApiGatewayV2Client {
  const awsConfig = getAWSConfig(config);
  return new ApiGatewayV2Client({
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
 * 向WebSocket连接发送消息
 */
export async function postToWebSocketConnection(
  client: ApiGatewayManagementApiClient,
  connectionId: string,
  data: string | Uint8Array
): Promise<void> {
  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: typeof data === 'string' ? new TextEncoder().encode(data) : data,
  });

  await client.send(command);
}

/**
 * 删除WebSocket连接
 */
export async function deleteWebSocketConnection(
  client: ApiGatewayManagementApiClient,
  connectionId: string
): Promise<void> {
  const command = new DeleteConnectionCommand({
    ConnectionId: connectionId,
  });

  await client.send(command);
}

/**
 * 获取WebSocket连接信息
 */
export async function getWebSocketConnection(
  client: ApiGatewayManagementApiClient,
  connectionId: string
): Promise<{ connectedAt?: Date; identity?: any } | null> {
  const command = new GetConnectionCommand({
    ConnectionId: connectionId,
  });

  try {
    const response = await client.send(command);
    return {
      connectedAt: response.ConnectedAt,
      identity: response.Identity,
    };
  } catch (error: any) {
    if (error.name === 'GoneException' || error.name === 'NotFoundException') {
      return null;
    }
    throw error;
  }
}

/**
 * 创建API Gateway V2 API
 */
export async function createAPIGatewayV2API(
  client: ApiGatewayV2Client,
  name: string,
  protocolType: 'WEBSOCKET' | 'HTTP'
): Promise<{ apiId?: string; apiEndpoint?: string }> {
  const command = new CreateApiCommand({
    Name: name,
    ProtocolType: protocolType as any,
  });

  const response = await client.send(command);
  return {
    apiId: response.ApiId,
    apiEndpoint: response.ApiEndpoint,
  };
}

/**
 * 获取API Gateway V2 API信息
 */
export async function getAPIGatewayV2API(
  client: ApiGatewayV2Client,
  apiId: string
): Promise<{
  apiId?: string;
  name?: string;
  protocolType?: string;
  apiEndpoint?: string;
} | null> {
  const command = new GetApiCommand({
    ApiId: apiId,
  });

  try {
    const response = await client.send(command);
    return {
      apiId: response.ApiId,
      name: response.Name,
      protocolType: response.ProtocolType,
      apiEndpoint: response.ApiEndpoint,
    };
  } catch (error: any) {
    if (error.name === 'NotFoundException') {
      return null;
    }
    throw error;
  }
}

/**
 * 创建API Gateway路由
 */
export async function createAPIGatewayRoute(
  client: ApiGatewayV2Client,
  apiId: string,
  routeKey: string,
  target?: string
): Promise<{ routeId?: string }> {
  const command = new CreateRouteCommand({
    ApiId: apiId,
    RouteKey: routeKey,
    Target: target,
  });

  const response = await client.send(command);
  return {
    routeId: response.RouteId,
  };
}

/**
 * 创建API Gateway集成
 */
export async function createAPIGatewayIntegration(
  client: ApiGatewayV2Client,
  apiId: string,
  integrationType: 'AWS_PROXY' | 'HTTP_PROXY' | 'MOCK' | 'HTTP',
  integrationUri?: string,
  integrationMethod?: string
): Promise<{ integrationId?: string }> {
  const command = new CreateIntegrationCommand({
    ApiId: apiId,
    IntegrationType: integrationType,
    IntegrationUri: integrationUri,
    IntegrationMethod: integrationMethod,
  });

  const response = await client.send(command);
  return {
    integrationId: response.IntegrationId,
  };
}
