package com.finpulse.server.order.domain.model;

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
public final class TradeOrder {
  @NonNull private final UUID orderId;
  @NonNull private UUID accountId;
  @NonNull private UUID instrumentId;
  @NonNull private String side;
  @NonNull private BigDecimal quantity;
  @NonNull private String orderType;
  @NonNull private String status;
  @NonNull private final Instant createdAt;

  public static TradeOrder create(UUID accountId, UUID instrumentId, String side, BigDecimal quantity, String orderType, String status) {
    String statusResolved = (status == null || status.isBlank()) ? "pending" : status;
    return new TradeOrder(UUID.randomUUID(), accountId, instrumentId, side, quantity, orderType, statusResolved, Instant.now());
  }

  public static TradeOrder rehydrate(UUID orderId, UUID accountId, UUID instrumentId, String side, BigDecimal quantity, String orderType, String status, Instant createdAt) {
    return new TradeOrder(orderId, accountId, instrumentId, side, quantity, orderType, status, createdAt);
  }

  public void update(@NonNull UUID accountId, @NonNull UUID instrumentId, @NonNull String side, @NonNull BigDecimal quantity, @NonNull String orderType, @NonNull String status) {
    this.accountId = accountId;
    this.instrumentId = instrumentId;
    this.side = side;
    this.quantity = quantity;
    this.orderType = orderType;
    this.status = status;
  }
}
