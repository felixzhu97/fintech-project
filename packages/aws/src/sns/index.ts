/**
 * AWS SNS消息通知集成
 * 提供消息发布、主题管理等基础功能
 */

import {
  SNSClient,
  PublishCommand,
  ListTopicsCommand,
  CreateTopicCommand,
  DeleteTopicCommand,
  SubscribeCommand,
  ListSubscriptionsByTopicCommand,
} from '@aws-sdk/client-sns';
import { getAWSConfig } from '../config';
import type { AWSConfig, SNSMessageOptions } from '../types';

/**
 * 创建SNS客户端
 */
export function createSNSClient(config?: Partial<AWSConfig>): SNSClient {
  const awsConfig = getAWSConfig(config);
  return new SNSClient({
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
 * 发布消息到SNS主题
 */
export async function publishSNSMessage(
  client: SNSClient,
  options: SNSMessageOptions
): Promise<{ messageId?: string }> {
  const command = new PublishCommand({
    TopicArn: options.topicArn,
    Message: options.message,
    Subject: options.subject,
    MessageAttributes: options.messageAttributes,
  });

  const response = await client.send(command);
  return {
    messageId: response.MessageId,
  };
}

/**
 * 列出所有SNS主题
 */
export async function listSNSTopics(
  client: SNSClient
): Promise<Array<{ topicArn: string }>> {
  const command = new ListTopicsCommand({});

  const response = await client.send(command);
  return (response.Topics || []).map((topic: any) => ({
    topicArn: topic.TopicArn || '',
  }));
}

/**
 * 创建SNS主题
 */
export async function createSNSTopic(
  client: SNSClient,
  topicName: string,
  attributes?: Record<string, string>
): Promise<{ topicArn?: string }> {
  const command = new CreateTopicCommand({
    Name: topicName,
    Attributes: attributes,
  });

  const response = await client.send(command);
  return {
    topicArn: response.TopicArn,
  };
}

/**
 * 删除SNS主题
 */
export async function deleteSNSTopic(
  client: SNSClient,
  topicArn: string
): Promise<void> {
  const command = new DeleteTopicCommand({
    TopicArn: topicArn,
  });

  await client.send(command);
}

/**
 * 订阅SNS主题
 */
export async function subscribeSNSTopic(
  client: SNSClient,
  topicArn: string,
  protocol: 'email' | 'sms' | 'sqs' | 'application' | 'lambda',
  endpoint: string,
  attributes?: Record<string, string>
): Promise<{ subscriptionArn?: string }> {
  const command = new SubscribeCommand({
    TopicArn: topicArn,
    Protocol: protocol,
    Endpoint: endpoint,
    Attributes: attributes,
  });

  const response = await client.send(command);
  return {
    subscriptionArn: response.SubscriptionArn,
  };
}

/**
 * 列出主题的所有订阅
 */
export async function listSNSSubscriptions(
  client: SNSClient,
  topicArn: string
): Promise<Array<{
  subscriptionArn?: string;
  protocol?: string;
  endpoint?: string;
}>> {
  const command = new ListSubscriptionsByTopicCommand({
    TopicArn: topicArn,
  });

  const response = await client.send(command);
  return (response.Subscriptions || []).map((sub: any) => ({
    subscriptionArn: sub.SubscriptionArn,
    protocol: sub.Protocol,
    endpoint: sub.Endpoint,
  }));
}
