package com.finpulse.server.cashtransaction.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class CashTransactionResponse {
  UUID transactionId;
  UUID accountId;
  String type;
  BigDecimal amount;
  String currency;
  String status;
  Instant createdAt;
}
