/**
 * AWS S3对象存储集成
 * 提供文件上传、下载、删除、列表等基础功能
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getAWSConfig } from '../config';
import type { AWSConfig, S3UploadOptions } from '../types';

/**
 * 创建S3客户端
 */
export function createS3Client(config?: Partial<AWSConfig>): S3Client {
  const awsConfig = getAWSConfig(config);
  return new S3Client({
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
 * 上传文件到S3
 */
export async function uploadToS3(
  client: S3Client,
  options: S3UploadOptions
): Promise<{ key: string; etag?: string }> {
  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: options.key,
    Body: options.body,
    ContentType: options.contentType,
    Metadata: options.metadata,
  });

  const response = await client.send(command);
  return {
    key: options.key,
    etag: response.ETag,
  };
}

/**
 * 从S3下载文件
 */
export async function downloadFromS3(
  client: S3Client,
  bucket: string,
  key: string
): Promise<Uint8Array> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  if (!response.Body) {
    throw new Error(`Object ${key} not found in bucket ${bucket}`);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }

  // 合并所有chunks
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

/**
 * 从S3删除文件
 */
export async function deleteFromS3(
  client: S3Client,
  bucket: string,
  key: string
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * 列出S3桶中的对象
 */
export async function listS3Objects(
  client: S3Client,
  bucket: string,
  prefix?: string,
  maxKeys?: number
): Promise<{ keys: string[]; isTruncated: boolean }> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await client.send(command);
  return {
    keys: (response.Contents || []).map((obj: any) => obj.Key || '').filter(Boolean),
    isTruncated: response.IsTruncated || false,
  };
}
