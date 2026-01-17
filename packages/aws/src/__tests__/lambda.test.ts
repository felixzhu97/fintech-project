import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createLambdaClient,
  invokeLambda,
  listLambdaFunctions,
  getLambdaFunction,
  getLambdaFunctionConfig,
} from "../lambda";

// Mock AWS SDK
vi.mock("@aws-sdk/client-lambda", () => {
  const mockSend = vi.fn();
  return {
    LambdaClient: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    InvokeCommand: vi.fn(),
    ListFunctionsCommand: vi.fn(),
    GetFunctionCommand: vi.fn(),
    GetFunctionConfigurationCommand: vi.fn(),
  };
});

describe("lambda", () => {
  describe("createLambdaClient()", () => {
    it("should create Lambda client with default config", () => {
      // Given
      const config = undefined;

      // When
      const client = createLambdaClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });

    it("should create Lambda client with custom config", () => {
      // Given
      const config = {
        region: "us-west-2",
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      };

      // When
      const client = createLambdaClient(config);

      // Then
      expect(client).toBeDefined();
      expect(client).toHaveProperty("send");
    });
  });

  describe("invokeLambda()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          StatusCode: 200,
          Payload: new TextEncoder().encode(JSON.stringify({ result: "success" })),
        }),
      };
    });

    it("should invoke Lambda function successfully", async () => {
      // Given
      const options = {
        functionName: "test-function",
        payload: JSON.stringify({ key: "value" }),
      };

      // When
      const result = await invokeLambda(mockClient, options);

      // Then
      expect(result.statusCode).toBe(200);
      expect(result.payload).toBeDefined();
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should invoke with RequestResponse invocation type", async () => {
      // Given
      const options = {
        functionName: "test-function",
        invocationType: "RequestResponse" as const,
      };

      // When
      await invokeLambda(mockClient, options);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should handle function error", async () => {
      // Given
      mockClient.send.mockResolvedValue({
        StatusCode: 200,
        FunctionError: "Unhandled",
        Payload: new TextEncoder().encode("Error message"),
      });
      const options = {
        functionName: "test-function",
      };

      // When
      const result = await invokeLambda(mockClient, options);

      // Then
      expect(result.error).toBe("Unhandled");
    });
  });

  describe("listLambdaFunctions()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Functions: [
            {
              FunctionName: "function-1",
              Runtime: "nodejs20.x",
              LastModified: new Date("2024-01-01"),
            },
            {
              FunctionName: "function-2",
              Runtime: "python3.11",
              LastModified: new Date("2024-01-02"),
            },
          ],
        }),
      };
    });

    it("should list Lambda functions successfully", async () => {
      // Given
      const maxItems = 10;

      // When
      const result = await listLambdaFunctions(mockClient, maxItems);

      // Then
      expect(result).toHaveLength(2);
      expect(result[0].functionName).toBe("function-1");
      expect(result[0].runtime).toBe("nodejs20.x");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return empty array when no functions exist", async () => {
      // Given
      mockClient.send.mockResolvedValue({ Functions: [] });

      // When
      const result = await listLambdaFunctions(mockClient);

      // Then
      expect(result).toHaveLength(0);
    });
  });

  describe("getLambdaFunction()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          Configuration: {
            FunctionName: "test-function",
            Runtime: "nodejs20.x",
            Handler: "index.handler",
            CodeSize: 1024,
            LastModified: new Date("2024-01-01"),
            Timeout: 30,
            MemorySize: 256,
          },
        }),
      };
    });

    it("should get Lambda function successfully", async () => {
      // Given
      const functionName = "test-function";

      // When
      const result = await getLambdaFunction(mockClient, functionName);

      // Then
      expect(result).toBeDefined();
      expect(result?.functionName).toBe("test-function");
      expect(result?.runtime).toBe("nodejs20.x");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return null when function not found", async () => {
      // Given
      const error = new Error("ResourceNotFoundException");
      (error as any).name = "ResourceNotFoundException";
      mockClient.send.mockRejectedValue(error);
      const functionName = "non-existent-function";

      // When
      const result = await getLambdaFunction(mockClient, functionName);

      // Then
      expect(result).toBeNull();
    });
  });

  describe("getLambdaFunctionConfig()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          FunctionName: "test-function",
          Runtime: "nodejs20.x",
          Handler: "index.handler",
          Timeout: 30,
          MemorySize: 256,
          Environment: {
            Variables: {
              KEY1: "value1",
              KEY2: "value2",
            },
          },
        }),
      };
    });

    it("should get Lambda function configuration successfully", async () => {
      // Given
      const functionName = "test-function";

      // When
      const result = await getLambdaFunctionConfig(mockClient, functionName);

      // Then
      expect(result).toBeDefined();
      expect(result?.functionName).toBe("test-function");
      expect(result?.environment).toEqual({
        KEY1: "value1",
        KEY2: "value2",
      });
      expect(mockClient.send).toHaveBeenCalled();
    });
  });
});
