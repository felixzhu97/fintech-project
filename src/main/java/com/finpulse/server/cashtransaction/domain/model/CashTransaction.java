package com.finpulse.server.cashtransaction.domain.model;

import java.math.BigDecimal;
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
public final class CashTransaction {
  @NonNull private final UUID transactionId;
  @NonNull private UUID accountId;
  @NonNull private String type;
  @NonNull private BigDecimal amount;
  @NonNull private String currency;
  @NonNull private String status;
  @NonNull private final Instant createdAt;

  public static CashTransaction create(UUID accountId, String type, BigDecimal amount, String currency, String status) {
    String statusResolved = (status == null || status.isBlank()) ? "completed" : status;
    return new CashTransaction(UUID.randomUUID(), accountId, type, amount, currency, statusResolved, Instant.now());
  }

  public static CashTransaction rehydrate(UUID transactionId, UUID accountId, String type, BigDecimal amount, String currency, String status, Instant createdAt) {
    return new CashTransaction(transactionId, accountId, type, amount, currency, status, createdAt);
  }

  public void update(@NonNull UUID accountId, @NonNull String type, @NonNull BigDecimal amount, @NonNull String currency, @NonNull String status) {
    this.accountId = accountId;
    this.type = type;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
  }
}
