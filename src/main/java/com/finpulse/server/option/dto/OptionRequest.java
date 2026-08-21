package com.finpulse.server.option.dto;

import jakarta.validation.constraints.NotBlank;
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
public class OptionRequest {
  @NotNull UUID instrumentId;
  @NotNull UUID underlyingInstrumentId;
  @NotNull BigDecimal strike;
  @NotNull Instant expiry;
  @NotBlank String optionType;
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
