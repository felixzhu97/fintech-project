import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createAPIGatewayManagementClient,
  createAPIGatewayV2Client,
  postToWebSocketConnection,
  deleteWebSocketConnection,
  getWebSocketConnection,
  createAPIGatewayV2API,
  getAPIGatewayV2API,
  createAPIGatewayRoute,
  createAPIGatewayIntegration,
} from "../api-gateway";

// Mock AWS SDK
vi.mock("@aws-sdk/client-apigatewaymanagementapi", () => {
  const mockSend = vi.fn();
  return {
    ApiGatewayManagementApiClient: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    PostToConnectionCommand: vi.fn(),
    DeleteConnectionCommand: vi.fn(),
    GetConnectionCommand: vi.fn(),
  };
});

vi.mock("@aws-sdk/client-apigatewayv2", () => {
  const mockSend = vi.fn();
  return {
    ApiGatewayV2Client: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    CreateApiCommand: vi.fn(),
    GetApiCommand: vi.fn(),
    CreateRouteCommand: vi.fn(),
    CreateIntegrationCommand: vi.fn(),
  };
});

describe("api-gateway", () => {
  describe("createAPIGatewayManagementClient()", () => {
    it("should create API Gateway Management client", () => {
      // Given
      const endpoint = "https://api-id.execute-api.us-east-1.amazonaws.com/prod";
      const config = undefined;

      // When
      const client = createAPIGatewayManagementClient(endpoint, config);

      // Then
      expect(client).toBeDefined();
    });
  });

  describe("createAPIGatewayV2Client()", () => {
    it("should create API Gateway V2 client with default config", () => {
      // Given
      const config = undefined;

      // When
      const client = createAPIGatewayV2Client(config);

      // Then
      expect(client).toBeDefined();
    });

    it("should create API Gateway V2 client with custom config", () => {
      // Given
      const config = {
        region: "us-west-2",
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      };

      // When
      const client = createAPIGatewayV2Client(config);

      // Then
      expect(client).toBeDefined();
    });
  });

  describe("postToWebSocketConnection()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({}),
      };
    });

    it("should post message to WebSocket connection successfully", async () => {
      // Given
      const connectionId = "test-connection-id";
      const data = "test message";

      // When
      await postToWebSocketConnection(mockClient, connectionId, data);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should post binary data to WebSocket connection", async () => {
      // Given
      const connectionId = "test-connection-id";
      const data = new Uint8Array([1, 2, 3, 4]);

      // When
      await postToWebSocketConnection(mockClient, connectionId, data);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("deleteWebSocketConnection()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({}),
      };
    });

    it("should delete WebSocket connection successfully", async () => {
      // Given
      const connectionId = "test-connection-id";

      // When
      await deleteWebSocketConnection(mockClient, connectionId);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("getWebSocketConnection()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          ConnectedAt: new Date("2024-01-01"),
          Identity: {
            sourceIp: "192.168.1.1",
          },
        }),
      };
    });

    it("should get WebSocket connection successfully", async () => {
      // Given
      const connectionId = "test-connection-id";

      // When
      const result = await getWebSocketConnection(mockClient, connectionId);

      // Then
      expect(result).toBeDefined();
      expect(result?.connectedAt).toBeInstanceOf(Date);
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return null when connection not found", async () => {
      // Given
      const error = new Error("GoneException");
      (error as any).name = "GoneException";
      mockClient.send.mockRejectedValue(error);
      const connectionId = "non-existent-connection-id";

      // When
      const result = await getWebSocketConnection(mockClient, connectionId);

      // Then
      expect(result).toBeNull();
    });
  });

  describe("createAPIGatewayV2API()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          ApiId: "test-api-id",
          ApiEndpoint: "https://test-api-id.execute-api.us-east-1.amazonaws.com",
        }),
      };
    });

    it("should create WebSocket API successfully", async () => {
      // Given
      const name = "test-websocket-api";
      const protocolType = "WEBSOCKET";

      // When
      const result = await createAPIGatewayV2API(mockClient, name, protocolType);

      // Then
      expect(result.apiId).toBe("test-api-id");
      expect(result.apiEndpoint).toBeDefined();
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should create HTTP API successfully", async () => {
      // Given
      const name = "test-http-api";
      const protocolType = "HTTP";

      // When
      const result = await createAPIGatewayV2API(mockClient, name, protocolType);

      // Then
      expect(result.apiId).toBe("test-api-id");
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("getAPIGatewayV2API()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          ApiId: "test-api-id",
          Name: "test-api",
          ProtocolType: "WEBSOCKET",
          ApiEndpoint: "https://test-api-id.execute-api.us-east-1.amazonaws.com",
        }),
      };
    });

    it("should get API Gateway V2 API successfully", async () => {
      // Given
      const apiId = "test-api-id";

      // When
      const result = await getAPIGatewayV2API(mockClient, apiId);

      // Then
      expect(result).toBeDefined();
      expect(result?.apiId).toBe("test-api-id");
      expect(result?.name).toBe("test-api");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should return null when API not found", async () => {
      // Given
      const error = new Error("NotFoundException");
      (error as any).name = "NotFoundException";
      mockClient.send.mockRejectedValue(error);
      const apiId = "non-existent-api-id";

      // When
      const result = await getAPIGatewayV2API(mockClient, apiId);

      // Then
      expect(result).toBeNull();
    });
  });

  describe("createAPIGatewayRoute()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          RouteId: "test-route-id",
        }),
      };
    });

    it("should create API Gateway route successfully", async () => {
      // Given
      const apiId = "test-api-id";
      const routeKey = "$connect";

      // When
      const result = await createAPIGatewayRoute(mockClient, apiId, routeKey);

      // Then
      expect(result.routeId).toBe("test-route-id");
      expect(mockClient.send).toHaveBeenCalled();
    });

    it("should create route with target", async () => {
      // Given
      const apiId = "test-api-id";
      const routeKey = "$default";
      const target = "integrations/test-integration-id";

      // When
      await createAPIGatewayRoute(mockClient, apiId, routeKey, target);

      // Then
      expect(mockClient.send).toHaveBeenCalled();
    });
  });

  describe("createAPIGatewayIntegration()", () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        send: vi.fn().mockResolvedValue({
          IntegrationId: "test-integration-id",
        }),
      };
    });

    it("should create API Gateway integration successfully", async () => {
      // Given
      const apiId = "test-api-id";
      const integrationType = "AWS_PROXY";
      const integrationUri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789:function:test-function/invocations";

      // When
      const result = await createAPIGatewayIntegration(
        mockClient,
        apiId,
        integrationType,
        integrationUri
      );

      // Then
      expect(result.integrationId).toBe("test-integration-id");
      expect(mockClient.send).toHaveBeenCalled();
    });
  });
});
