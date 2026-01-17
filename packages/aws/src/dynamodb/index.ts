/**
 * AWS DynamoDB数据库集成
 * 提供数据读写、查询、扫描等基础功能
 */

import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { getAWSConfig } from '../config';
import type { AWSConfig, DynamoDBItem, DynamoDBQueryOptions } from '../types';

/**
 * 创建DynamoDB客户端
 */
export function createDynamoDBClient(config?: Partial<AWSConfig>): DynamoDBClient {
  const awsConfig = getAWSConfig(config);
  return new DynamoDBClient({
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
 * 写入数据到DynamoDB
 */
export async function putDynamoDBItem(
  client: DynamoDBClient,
  tableName: string,
  item: DynamoDBItem
): Promise<void> {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: marshall(item),
  });

  await client.send(command);
}

/**
 * 从DynamoDB读取数据
 */
export async function getDynamoDBItem(
  client: DynamoDBClient,
  tableName: string,
  key: DynamoDBItem
): Promise<DynamoDBItem | null> {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: marshall(key),
  });

  const response = await client.send(command);
  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item) as DynamoDBItem;
}

/**
 * 从DynamoDB删除数据
 */
export async function deleteDynamoDBItem(
  client: DynamoDBClient,
  tableName: string,
  key: DynamoDBItem
): Promise<void> {
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: marshall(key),
  });

  await client.send(command);
}

/**
 * 查询DynamoDB数据
 */
export async function queryDynamoDB(
  client: DynamoDBClient,
  options: DynamoDBQueryOptions
): Promise<DynamoDBItem[]> {
  const command = new QueryCommand({
    TableName: options.tableName,
    KeyConditionExpression: options.keyConditionExpression,
    ExpressionAttributeValues: marshall(options.expressionAttributeValues),
    ExpressionAttributeNames: options.expressionAttributeNames,
  });

  const response = await client.send(command);
  return (response.Items || []).map((item: any) => unmarshall(item) as DynamoDBItem);
}

/**
 * 扫描DynamoDB表
 */
export async function scanDynamoDB(
  client: DynamoDBClient,
  tableName: string,
  filterExpression?: string,
  expressionAttributeValues?: Record<string, any>,
  expressionAttributeNames?: Record<string, string>,
  limit?: number
): Promise<DynamoDBItem[]> {
  const command = new ScanCommand({
    TableName: tableName,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues
      ? marshall(expressionAttributeValues)
      : undefined,
    ExpressionAttributeNames: expressionAttributeNames,
    Limit: limit,
  });

  const response = await client.send(command);
  return (response.Items || []).map((item: any) => unmarshall(item) as DynamoDBItem);
}
