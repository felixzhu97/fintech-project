package com.finpulse.server.order.dto;

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
public class TradeOrderRequest {
  @NotNull UUID accountId;
  @NotNull UUID instrumentId;
  @NotBlank String side;
  @NotNull BigDecimal quantity;
  @NotBlank String orderType;
  @NotBlank String status;
}
