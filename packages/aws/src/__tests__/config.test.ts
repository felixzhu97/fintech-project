import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAWSConfig } from "../config";

describe("config", () => {
  describe("getAWSConfig()", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // 清理环境变量
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    describe("when config is provided", () => {
      it("should use provided config values", () => {
        // Given
        const config = {
          region: "us-west-2",
          accessKeyId: "test-key-id",
          secretAccessKey: "test-secret-key",
          endpoint: "http://localhost:4566",
        };

        // When
        const result = getAWSConfig(config);

        // Then
        expect(result.region).toBe("us-west-2");
        expect(result.accessKeyId).toBe("test-key-id");
        expect(result.secretAccessKey).toBe("test-secret-key");
        expect(result.endpoint).toBe("http://localhost:4566");
      });
    });

    describe("when config is not provided", () => {
      it("should read from AWS_REGION environment variable", () => {
        // Given
        process.env.AWS_REGION = "eu-west-1";
        delete process.env.AWS_DEFAULT_REGION;

        // When
        const result = getAWSConfig();

        // Then
        expect(result.region).toBe("eu-west-1");
      });

      it("should read from AWS_DEFAULT_REGION when AWS_REGION is not set", () => {
        // Given
        delete process.env.AWS_REGION;
        process.env.AWS_DEFAULT_REGION = "ap-southeast-1";

        // When
        const result = getAWSConfig();

        // Then
        expect(result.region).toBe("ap-southeast-1");
      });

      it("should default to us-east-1 when no region is set", () => {
        // Given
        delete process.env.AWS_REGION;
        delete process.env.AWS_DEFAULT_REGION;

        // When
        const result = getAWSConfig();

        // Then
        expect(result.region).toBe("us-east-1");
      });

      it("should read from AWS_ACCESS_KEY_ID environment variable", () => {
        // Given
        process.env.AWS_ACCESS_KEY_ID = "env-key-id";

        // When
        const result = getAWSConfig();

        // Then
        expect(result.accessKeyId).toBe("env-key-id");
      });

      it("should read from AWS_SECRET_ACCESS_KEY environment variable", () => {
        // Given
        process.env.AWS_SECRET_ACCESS_KEY = "env-secret-key";

        // When
        const result = getAWSConfig();

        // Then
        expect(result.secretAccessKey).toBe("env-secret-key");
      });

      it("should read from AWS_ENDPOINT_URL environment variable", () => {
        // Given
        process.env.AWS_ENDPOINT_URL = "http://localhost:8000";

        // When
        const result = getAWSConfig();

        // Then
        expect(result.endpoint).toBe("http://localhost:8000");
      });
    });

    describe("when both config and environment variables are provided", () => {
      it("should prioritize config over environment variables", () => {
        // Given
        process.env.AWS_REGION = "eu-west-1";
        process.env.AWS_ACCESS_KEY_ID = "env-key";
        const config = {
          region: "us-west-2",
          accessKeyId: "config-key",
        };

        // When
        const result = getAWSConfig(config);

        // Then
        expect(result.region).toBe("us-west-2");
        expect(result.accessKeyId).toBe("config-key");
      });
    });
  });
});
