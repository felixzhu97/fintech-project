import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createSQSClient,
  sendSQSMessage,
  receiveSQSMessage,
  deleteSQSMessage,
  getSQSQueueUrl,
} from "../sqs";

// Mock AWS SDK
vi.mock("@aws-sdk/client-sqs", () => {
  const mockSend = vi.fn();
  return {
    SQSClient: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    SendMessageCommand: vi.fn(),
    ReceiveMessageCommand: vi.fn(),
    DeleteMessageCommand: vi.fn(),
    GetQueueUrlCommand: vi.fn(),
  };
});

describe("sqs", () => {
  describe("createSQSClient()", () => {
    it("should create SQS client with default config", () => {
      // Given
      const config = undefined;

      // When
      const client = createSQSClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });

    it("should create SQS client with custom config", () => {
      // Given
      const config = {
        region: "us-west-2",
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      };

      // When
      const client = createSQSClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });
  });

  describe("sendSQSMessage()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          MessageId: "test-message-id",
          MD5OfBody: "test-md5",
        }),
      };
    });

    it("should send message to SQS queue successfully", async () => {
      // Given
      const options = {
        queueUrl: "https://sqs.us-east-1.amazonaws.com/123456789/test-queue",
        messageBody: JSON.stringify({ key: "value" }),
      };

      // When
      const result = await sendSQSMessage(mockClient, options);

      // Then
      expect(result.messageId).toBe("test-message-id");
      expect(result.md5OfBody).toBe("test-md5");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should send message with attributes", async () => {
      // Given
      const options = {
        queueUrl: "https://sqs.us-east-1.amazonaws.com/123456789/test-queue",
        messageBody: "test message",
        messageAttributes: {
          attribute1: {
            DataType: "String",
            StringValue: "value1",
          },
        },
      };

      // When
      await sendSQSMessage(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should send message with delay", async () => {
      // Given
      const options = {
        queueUrl: "https://sqs.us-east-1.amazonaws.com/123456789/test-queue",
        messageBody: "test message",
        delaySeconds: 5,
      };

      // When
      await sendSQSMessage(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("receiveSQSMessage()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Messages: [
            {
              MessageId: "msg-1",
              ReceiptHandle: "receipt-1",
              Body: JSON.stringify({ key: "value" }),
              MessageAttributes: {
                attr1: {
                  StringValue: "value1",
                },
              },
            },
          ],
        }),
      };
    });

    it("should receive message from SQS queue successfully", async () => {
      // Given
      const queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789/test-queue";

      // When
      const result = await receiveSQSMessage(mockClient, queueUrl);

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].messageId).toBe("msg-1");
      expect(result[0].receiptHandle).toBe("receipt-1");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should receive multiple messages", async () => {
      // Given
      mockClient.send.mockResolvedValue({
        Messages: [
          { MessageId: "msg-1", ReceiptHandle: "receipt-1", Body: "body1" },
          { MessageId: "msg-2", ReceiptHandle: "receipt-2", Body: "body2" },
        ],
      });
      const queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789/test-queue";

      // When
      const result = await receiveSQSMessage(mockClient, queueUrl, 2);

      // Then
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no messages available", async () => {
      // Given
      mockClient.send.mockResolvedValue({ Messages: [] });
      const queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789/test-queue";

      // When
      const result = await receiveSQSMessage(mockClient, queueUrl);

      // Then
      expect(result).toHaveLength(0);
    });
  });

  describe("deleteSQSMessage()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({}),
      };
    });

    it("should delete message from SQS queue successfully", async () => {
      // Given
      const queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789/test-queue";
      const receiptHandle = "test-receipt-handle";

      // When
      await deleteSQSMessage(mockClient, queueUrl, receiptHandle);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("getSQSQueueUrl()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789/test-queue",
        }),
      };
    });

    it("should get queue URL successfully", async () => {
      // Given
      const queueName = "test-queue";

      // When
      const result = await getSQSQueueUrl(mockClient, queueName);

      // Then
      expect(result).toBe("https://sqs.us-east-1.amazonaws.com/123456789/test-queue");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should throw error when queue not found", async () => {
      // Given
      mockClient.send.mockResolvedValue({ QueueUrl: undefined });
      const queueName = "non-existent-queue";

      // When & Then
      await expect(getSQSQueueUrl(mockClient, queueName)).rejects.toThrow(
        "Queue non-existent-queue not found"
      );
    });
  });
});
