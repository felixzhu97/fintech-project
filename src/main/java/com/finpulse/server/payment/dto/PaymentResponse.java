package com.finpulse.server.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class PaymentResponse {
  UUID paymentId;
  UUID accountId;
  String counterparty;
  BigDecimal amount;
  String currency;
  String status;
  Instant createdAt;
}
