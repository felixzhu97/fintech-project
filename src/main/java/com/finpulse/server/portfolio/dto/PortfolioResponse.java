package com.finpulse.server.portfolio.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class PortfolioResponse {
  UUID portfolioId;
  UUID accountId;
  String name;
  String baseCurrency;
  Instant createdAt;
}
