package com.finpulse.server.option.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class OptionResponse {
  UUID optionId;
  UUID instrumentId;
  UUID underlyingInstrumentId;
  BigDecimal strike;
  Instant expiry;
  String optionType;
  BigDecimal riskFreeRate;
  BigDecimal volatility;
  BigDecimal bsPrice;
  BigDecimal delta;
  BigDecimal gamma;
  BigDecimal theta;
  BigDecimal vega;
  BigDecimal rho;
  BigDecimal impliedVolatility;
}
