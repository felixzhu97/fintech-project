import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createSNSClient,
  publishSNSMessage,
  listSNSTopics,
  createSNSTopic,
  deleteSNSTopic,
  subscribeSNSTopic,
  listSNSSubscriptions,
} from "../sns";

// Mock AWS SDK
vi.mock("@aws-sdk/client-sns", () => {
  const mockSend = vi.fn();
  return {
    SNSClient: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    PublishCommand: vi.fn(),
    ListTopicsCommand: vi.fn(),
    CreateTopicCommand: vi.fn(),
    DeleteTopicCommand: vi.fn(),
    SubscribeCommand: vi.fn(),
    ListSubscriptionsByTopicCommand: vi.fn(),
  };
});

describe("sns", () => {
  describe("createSNSClient()", () => {
    it("should create SNS client with default config", () => {
      // Given
      const config = undefined;

      // When
      const client = createSNSClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });

    it("should create SNS client with custom config", () => {
      // Given
      const config = {
        region: "us-west-2",
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      };

      // When
      const client = createSNSClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });
  });

  describe("publishSNSMessage()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          MessageId: "test-message-id",
        }),
      };
    });

    it("should publish message to SNS topic successfully", async () => {
      // Given
      const options = {
        topicArn: "arn:aws:sns:us-east-1:123456789:test-topic",
        message: "test message",
      };

      // When
      const result = await publishSNSMessage(mockClient, options);

      // Then
      expect(result.messageId).toBe("test-message-id");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should publish message with subject", async () => {
      // Given
      const options = {
        topicArn: "arn:aws:sns:us-east-1:123456789:test-topic",
        message: "test message",
        subject: "Test Subject",
      };

      // When
      await publishSNSMessage(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should publish message with attributes", async () => {
      // Given
      const options = {
        topicArn: "arn:aws:sns:us-east-1:123456789:test-topic",
        message: "test message",
        messageAttributes: {
          attribute1: {
            DataType: "String",
            StringValue: "value1",
          },
        },
      };

      // When
      await publishSNSMessage(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("listSNSTopics()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Topics: [
            { TopicArn: "arn:aws:sns:us-east-1:123456789:topic-1" },
            { TopicArn: "arn:aws:sns:us-east-1:123456789:topic-2" },
          ],
        }),
      };
    });

    it("should list SNS topics successfully", async () => {
      // When
      const result = await listSNSTopics(mockClient);

      // Then
      expect(result).toHaveLength(2);
      expect(result[0].topicArn).toBe("arn:aws:sns:us-east-1:123456789:topic-1");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return empty array when no topics exist", async () => {
      // Given
      mockClient.send.mockResolvedValue({ Topics: [] });

      // When
      const result = await listSNSTopics(mockClient);

      // Then
      expect(result).toHaveLength(0);
    });
  });

  describe("createSNSTopic()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          TopicArn: "arn:aws:sns:us-east-1:123456789:test-topic",
        }),
      };
    });

    it("should create SNS topic successfully", async () => {
      // Given
      const topicName = "test-topic";

      // When
      const result = await createSNSTopic(mockClient, topicName);

      // Then
      expect(result.topicArn).toBe("arn:aws:sns:us-east-1:123456789:test-topic");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should create topic with attributes", async () => {
      // Given
      const topicName = "test-topic";
      const attributes = {
        DisplayName: "Test Topic",
      };

      // When
      await createSNSTopic(mockClient, topicName, attributes);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("deleteSNSTopic()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({}),
      };
    });

    it("should delete SNS topic successfully", async () => {
      // Given
      const topicArn = "arn:aws:sns:us-east-1:123456789:test-topic";

      // When
      await deleteSNSTopic(mockClient, topicArn);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("subscribeSNSTopic()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          SubscriptionArn: "arn:aws:sns:us-east-1:123456789:test-topic:subscription-id",
        }),
      };
    });

    it("should subscribe to SNS topic successfully", async () => {
      // Given
      const topicArn = "arn:aws:sns:us-east-1:123456789:test-topic";
      const protocol = "email";
      const endpoint = "test@example.com";

      // When
      const result = await subscribeSNSTopic(mockClient, topicArn, protocol, endpoint);

      // Then
      expect(result.subscriptionArn).toBeDefined();
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should subscribe with attributes", async () => {
      // Given
      const topicArn = "arn:aws:sns:us-east-1:123456789:test-topic";
      const protocol = "sqs";
      const endpoint = "arn:aws:sqs:us-east-1:123456789:test-queue";
      const attributes = {
        RawMessageDelivery: "true",
      };

      // When
      await subscribeSNSTopic(mockClient, topicArn, protocol, endpoint, attributes);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("listSNSSubscriptions()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Subscriptions: [
            {
              SubscriptionArn: "arn:aws:sns:us-east-1:123456789:test-topic:sub-1",
              Protocol: "email",
              Endpoint: "test@example.com",
            },
            {
              SubscriptionArn: "arn:aws:sns:us-east-1:123456789:test-topic:sub-2",
              Protocol: "sms",
              Endpoint: "+1234567890",
            },
          ],
        }),
      };
    });

    it("should list SNS subscriptions successfully", async () => {
      // Given
      const topicArn = "arn:aws:sns:us-east-1:123456789:test-topic";

      // When
      const result = await listSNSSubscriptions(mockClient, topicArn);

      // Then
      expect(result).toHaveLength(2);
      expect(result[0].protocol).toBe("email");
      expect(result[0].endpoint).toBe("test@example.com");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return empty array when no subscriptions exist", async () => {
      // Given
      mockClient.send.mockResolvedValue({ Subscriptions: [] });
      const topicArn = "arn:aws:sns:us-east-1:123456789:test-topic";

      // When
      const result = await listSNSSubscriptions(mockClient, topicArn);

      // Then
      expect(result).toHaveLength(0);
    });
  });
});
