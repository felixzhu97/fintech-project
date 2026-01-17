/**
 * AWS SQS消息队列集成
 * 提供消息发送、接收、删除等基础功能
 */

import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
} from '@aws-sdk/client-sqs';
import { getAWSConfig } from '../config';
import type { AWSConfig, SQSMessageOptions } from '../types';

/**
 * 创建SQS客户端
 */
export function createSQSClient(config?: Partial<AWSConfig>): SQSClient {
  const awsConfig = getAWSConfig(config);
  return new SQSClient({
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
 * 发送消息到SQS队列
 */
export async function sendSQSMessage(
  client: SQSClient,
  options: SQSMessageOptions
): Promise<{ messageId?: string; md5OfBody?: string }> {
  const command = new SendMessageCommand({
    QueueUrl: options.queueUrl,
    MessageBody: options.messageBody,
    MessageAttributes: options.messageAttributes,
    DelaySeconds: options.delaySeconds,
  });

  const response = await client.send(command);
  return {
    messageId: response.MessageId,
    md5OfBody: (response as any).MD5OfBody || (response as any).MD5OfMessageBody,
  };
}

/**
 * 从SQS队列接收消息
 */
export async function receiveSQSMessage(
  client: SQSClient,
  queueUrl: string,
  maxNumberOfMessages: number = 1,
  waitTimeSeconds?: number,
  visibilityTimeout?: number
): Promise<Array<{
  messageId?: string;
  receiptHandle?: string;
  body?: string;
  attributes?: Record<string, string>;
}>> {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxNumberOfMessages,
    WaitTimeSeconds: waitTimeSeconds,
    VisibilityTimeout: visibilityTimeout,
    MessageAttributeNames: ['All'],
    AttributeNames: ['All'],
  });

  const response = await client.send(command);
  return (response.Messages || []).map((msg: any) => ({
    messageId: msg.MessageId,
    receiptHandle: msg.ReceiptHandle,
    body: msg.Body,
    attributes: msg.MessageAttributes
      ? Object.fromEntries(
          Object.entries(msg.MessageAttributes).map(([key, attr]: [string, any]) => [
            key,
            attr.StringValue || '',
          ])
        )
      : undefined,
  }));
}

/**
 * 从SQS队列删除消息
 */
export async function deleteSQSMessage(
  client: SQSClient,
  queueUrl: string,
  receiptHandle: string
): Promise<void> {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  await client.send(command);
}

/**
 * 获取队列URL
 */
export async function getSQSQueueUrl(
  client: SQSClient,
  queueName: string,
  queueOwnerAWSAccountId?: string
): Promise<string> {
  const command = new GetQueueUrlCommand({
    QueueName: queueName,
    QueueOwnerAWSAccountId: queueOwnerAWSAccountId,
  });

  const response = await client.send(command);
  if (!response.QueueUrl) {
    throw new Error(`Queue ${queueName} not found`);
  }
  return response.QueueUrl;
}
