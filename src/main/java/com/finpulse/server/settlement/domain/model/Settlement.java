package com.finpulse.server.settlement.domain.model;

import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Settlement {
  @NonNull private final UUID settlementId;
  @NonNull private UUID tradeId;
  @NonNull private UUID paymentId;
  @NonNull private String status;
  private Instant settledAt;

  public static Settlement create(UUID tradeId, UUID paymentId, String status, Instant settledAt) {
    String statusResolved = (status == null || status.isBlank()) ? "pending" : status;
    return new Settlement(UUID.randomUUID(), tradeId, paymentId, statusResolved, settledAt);
  }

  public static Settlement rehydrate(UUID settlementId, UUID tradeId, UUID paymentId, String status, Instant settledAt) {
    return new Settlement(settlementId, tradeId, paymentId, status, settledAt);
  }

  public void update(@NonNull UUID tradeId, @NonNull UUID paymentId, @NonNull String status, Instant settledAt) {
    this.tradeId = tradeId;
    this.paymentId = paymentId;
    this.status = status;
    this.settledAt = settledAt;
  }
}
