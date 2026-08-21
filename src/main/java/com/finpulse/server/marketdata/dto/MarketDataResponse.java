package com.finpulse.server.marketdata.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class MarketDataResponse {
  UUID dataId;
  UUID instrumentId;
  Instant timestamp;
  BigDecimal open;
  BigDecimal high;
  BigDecimal low;
  BigDecimal close;
  BigDecimal volume;
  BigDecimal changePct;
}
