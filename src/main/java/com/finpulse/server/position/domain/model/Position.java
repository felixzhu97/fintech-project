package com.finpulse.server.position.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Position {
  @NonNull private final UUID positionId;
  @NonNull private UUID portfolioId;
  @NonNull private UUID instrumentId;
  @NonNull private BigDecimal quantity;
  private BigDecimal costBasis;
  @NonNull private final LocalDate asOfDate;

  public static Position create(UUID portfolioId, UUID instrumentId, BigDecimal quantity, BigDecimal costBasis) {
    return new Position(UUID.randomUUID(), portfolioId, instrumentId, quantity, costBasis, LocalDate.now());
  }

  public static Position rehydrate(UUID positionId, UUID portfolioId, UUID instrumentId, BigDecimal quantity, BigDecimal costBasis, LocalDate asOfDate) {
    return new Position(positionId, portfolioId, instrumentId, quantity, costBasis, asOfDate);
  }

  public void update(@NonNull UUID portfolioId, @NonNull UUID instrumentId, @NonNull BigDecimal quantity, BigDecimal costBasis) {
    this.portfolioId = portfolioId;
    this.instrumentId = instrumentId;
    this.quantity = quantity;
    this.costBasis = costBasis;
  }
}
