package com.finpulse.server.quote.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class QuoteResponse {
  BigDecimal price;
  BigDecimal change;
  BigDecimal changeRate;
  long timestamp;
}
