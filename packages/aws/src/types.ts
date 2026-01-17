/**
 * AWS集成工具包共享类型定义
 */

export interface AWSConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

export interface S3UploadOptions {
  bucket: string;
  key: string;
  body: Buffer | string | Uint8Array;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface DynamoDBItem {
  [key: string]: any;
}

export interface DynamoDBQueryOptions {
  tableName: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
}

export interface SQSMessageOptions {
  queueUrl: string;
  messageBody: string;
  messageAttributes?: Record<string, { DataType: string; StringValue?: string; BinaryValue?: Buffer }>;
  delaySeconds?: number;
}

export interface SNSMessageOptions {
  topicArn: string;
  message: string;
  subject?: string;
  messageAttributes?: Record<string, { DataType: string; StringValue?: string }>;
}

export interface LambdaInvokeOptions {
  functionName: string;
  payload?: string | Buffer | Uint8Array;
  invocationType?: 'Event' | 'RequestResponse' | 'DryRun';
}
