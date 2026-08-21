package com.finpulse.server.position.dto;

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
public class PositionRequest {
  @NotNull UUID portfolioId;
  @NotNull UUID instrumentId;
  @NotNull BigDecimal quantity;
  BigDecimal costBasis;
}
