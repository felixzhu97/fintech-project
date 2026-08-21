package com.finpulse.server.position.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class PositionResponse {
  UUID positionId;
  UUID portfolioId;
  UUID instrumentId;
  BigDecimal quantity;
  BigDecimal costBasis;
  LocalDate asOfDate;
}
