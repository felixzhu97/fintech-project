package com.finpulse.server.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class TradeOrderResponse {
  UUID orderId;
  UUID accountId;
  UUID instrumentId;
  String side;
  BigDecimal quantity;
  String orderType;
  String status;
  Instant createdAt;
}
