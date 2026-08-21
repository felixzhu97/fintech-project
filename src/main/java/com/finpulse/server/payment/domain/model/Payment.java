package com.finpulse.server.payment.domain.model;

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
public final class Payment {
  @NonNull private final UUID paymentId;
  @NonNull private UUID accountId;
  private String counterparty;
  @NonNull private BigDecimal amount;
  @NonNull private String currency;
  @NonNull private String status;
  @NonNull private final Instant createdAt;

  public static Payment create(UUID accountId, String counterparty, BigDecimal amount, String currency, String status) {
    String statusResolved = (status == null || status.isBlank()) ? "pending" : status;
    return new Payment(UUID.randomUUID(), accountId, counterparty, amount, currency, statusResolved, Instant.now());
  }

  public static Payment rehydrate(UUID paymentId, UUID accountId, String counterparty, BigDecimal amount, String currency, String status, Instant createdAt) {
    return new Payment(paymentId, accountId, counterparty, amount, currency, status, createdAt);
  }

  public void update(@NonNull UUID accountId, String counterparty, @NonNull BigDecimal amount, @NonNull String currency, @NonNull String status) {
    this.accountId = accountId;
    this.counterparty = counterparty;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
  }
}
