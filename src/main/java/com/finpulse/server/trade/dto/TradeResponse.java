package com.finpulse.server.trade.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class TradeResponse {
  UUID tradeId;
  UUID orderId;
  BigDecimal quantity;
  BigDecimal price;
  BigDecimal fee;
  Instant executedAt;
}
