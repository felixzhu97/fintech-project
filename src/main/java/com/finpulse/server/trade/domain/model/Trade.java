package com.finpulse.server.trade.domain.model;

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
public final class Trade {
  @NonNull private final UUID tradeId;
  @NonNull private UUID orderId;
  @NonNull private BigDecimal quantity;
  @NonNull private BigDecimal price;
  private BigDecimal fee;
  @NonNull private final Instant executedAt;

  public static Trade create(UUID orderId, BigDecimal quantity, BigDecimal price, BigDecimal fee) {
    return new Trade(UUID.randomUUID(), orderId, quantity, price, fee, Instant.now());
  }

  public static Trade rehydrate(UUID tradeId, UUID orderId, BigDecimal quantity, BigDecimal price, BigDecimal fee, Instant executedAt) {
    return new Trade(tradeId, orderId, quantity, price, fee, executedAt);
  }

  public void update(@NonNull UUID orderId, @NonNull BigDecimal quantity, @NonNull BigDecimal price, BigDecimal fee) {
    this.orderId = orderId;
    this.quantity = quantity;
    this.price = price;
    this.fee = fee;
  }
}
