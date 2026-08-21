package com.finpulse.server.portfolio.domain.model;

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
public final class Portfolio {
  @NonNull private final UUID portfolioId;
  @NonNull private UUID accountId;
  @NonNull private String name;
  @NonNull private String baseCurrency;
  @NonNull private final Instant createdAt;

  public static Portfolio create(UUID accountId, String name, String baseCurrency) {
    return new Portfolio(UUID.randomUUID(), accountId, name, baseCurrency, Instant.now());
  }

  public static Portfolio rehydrate(UUID portfolioId, UUID accountId, String name, String baseCurrency, Instant createdAt) {
    return new Portfolio(portfolioId, accountId, name, baseCurrency, createdAt);
  }

  public void update(@NonNull UUID accountId, @NonNull String name, @NonNull String baseCurrency) {
    this.accountId = accountId;
    this.name = name;
    this.baseCurrency = baseCurrency;
  }
}
