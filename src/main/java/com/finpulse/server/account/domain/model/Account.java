package com.finpulse.server.account.domain.model;

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
public final class Account {
  @NonNull private final UUID accountId;
  @NonNull private UUID customerId;
  @NonNull private String accountType;
  @NonNull private String currency;
  @NonNull private String status;
  @NonNull private final Instant openedAt;

  public static Account create(
      UUID customerId, String accountType, String currency, String status) {
    String resolved = (status == null || status.isBlank()) ? "active" : status;
    return new Account(
        UUID.randomUUID(), customerId, accountType, currency, resolved, Instant.now());
  }

  public static Account rehydrate(
      UUID accountId,
      UUID customerId,
      String accountType,
      String currency,
      String status,
      Instant openedAt) {
    return new Account(accountId, customerId, accountType, currency, status, openedAt);
  }

  public void update(
      @NonNull UUID customerId,
      @NonNull String accountType,
      @NonNull String currency,
      @NonNull String status) {
    this.customerId = customerId;
    this.accountType = accountType;
    this.currency = currency;
    this.status = status;
  }
}
