package com.finpulse.server.settlement.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class SettlementResponse {
  UUID settlementId;
  UUID tradeId;
  UUID paymentId;
  String status;
  Instant settledAt;
}
