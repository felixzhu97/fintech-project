package com.finpulse.server.account.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class AccountResponse {
  UUID accountId;
  UUID customerId;
  String accountType;
  String currency;
  String status;
  Instant openedAt;
}
