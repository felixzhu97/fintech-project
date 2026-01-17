import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createS3Client,
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  listS3Objects,
} from "../s3";

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3", () => {
  const mockSend = vi.fn();
  return {
    S3Client: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    PutObjectCommand: vi.fn(),
    GetObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
    ListObjectsV2Command: vi.fn(),
  };
});

describe("s3", () => {
  describe("createS3Client()", () => {
    it("should create S3 client with default config", () => {
      // Given
      const config = undefined;

      // When
      const client = createS3Client(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });

    it("should create S3 client with custom config", () => {
      // Given
      const config = {
        region: "us-west-2",
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      };

      // When
      const client = createS3Client(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });
  });

  describe("uploadToS3()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          ETag: '"test-etag"',
        }),
      };
    });

    it("should upload file to S3 successfully", async () => {
      // Given
      const options = {
        bucket: "test-bucket",
        key: "test-key",
        body: "test content",
      };

      // When
      const result = await uploadToS3(mockClient, options);

      // Then
      expect(result.key).toBe("test-key");
      expect(result.etag).toBe('"test-etag"');
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should upload file with metadata", async () => {
      // Given
      const options = {
        bucket: "test-bucket",
        key: "test-key",
        body: "test content",
        contentType: "text/plain",
        metadata: { key1: "value1" },
      };

      // When
      await uploadToS3(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("downloadFromS3()", () => {
    let mockClient: any;

    beforeEach(() => {
      const mockChunks = [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([4, 5, 6]),
      ];
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Body: {
            [Symbol.asyncIterator]: async function* () {
              for (const chunk of mockChunks) {
                yield chunk;
              }
            },
          },
        }),
      };
    });

    it("should download file from S3 successfully", async () => {
      // Given
      const bucket = "test-bucket";
      const key = "test-key";

      // When
      const result = await downloadFromS3(mockClient, bucket, key);

      // Then
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(6);
      expect(Array.from(result)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should throw error when object not found", async () => {
      // Given
      const bucket = "test-bucket";
      const key = "non-existent-key";
      mockClient.send.mockResolvedValue({
        Body: null,
      });

      // When & Then
      await expect(downloadFromS3(mockClient, bucket, key)).rejects.toThrow(
        "Object non-existent-key not found in bucket test-bucket"
      );
    });
  });

  describe("deleteFromS3()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({}),
      };
    });

    it("should delete file from S3 successfully", async () => {
      // Given
      const bucket = "test-bucket";
      const key = "test-key";

      // When
      await deleteFromS3(mockClient, bucket, key);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("listS3Objects()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Contents: [
            { Key: "file1.txt" },
            { Key: "file2.txt" },
            { Key: "folder/file3.txt" },
          ],
          IsTruncated: false,
        }),
      };
    });

    it("should list objects in S3 bucket", async () => {
      // Given
      const bucket = "test-bucket";

      // When
      const result = await listS3Objects(mockClient, bucket);

      // Then
      expect(result.keys).toHaveLength(3);
      expect(result.keys).toContain("file1.txt");
      expect(result.keys).toContain("file2.txt");
      expect(result.keys).toContain("folder/file3.txt");
      expect(result.isTruncated).toBe(false);
    });

    it("should list objects with prefix", async () => {
      // Given
      const bucket = "test-bucket";
      const prefix = "folder/";

      // When
      await listS3Objects(mockClient, bucket, prefix);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should handle truncated results", async () => {
      // Given
      mockClient.send.mockResolvedValue({
        Contents: [{ Key: "file1.txt" }],
        IsTruncated: true,
      });

      // When
      const result = await listS3Objects(mockClient, "test-bucket");

      // Then
      expect(result.isTruncated).toBe(true);
    });
  });
});
