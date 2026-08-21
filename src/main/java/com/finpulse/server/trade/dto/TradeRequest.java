package com.finpulse.server.trade.dto;

import java.math.BigDecimal;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class TradeRequest {
  @NotNull UUID orderId;
  @NotNull BigDecimal quantity;
  @NotNull BigDecimal price;
  BigDecimal fee;
}
