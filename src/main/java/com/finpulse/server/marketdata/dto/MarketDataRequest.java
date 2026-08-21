package com.finpulse.server.marketdata.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class MarketDataRequest {
  @NotNull UUID instrumentId;
  @NotNull Instant timestamp;
  BigDecimal open;
  BigDecimal high;
  BigDecimal low;
  @NotNull BigDecimal close;
  BigDecimal volume;
  BigDecimal changePct;
}
