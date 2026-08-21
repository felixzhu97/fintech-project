package com.finpulse.server.trade.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TradeEntity {
  @Id
  @Column(name = "trade_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID tradeId;
  @Column(name = "order_id", nullable = false)
  private UUID orderId;
  @Column(name = "quantity", nullable = false)
  private BigDecimal quantity;
  @Column(name = "price", nullable = false)
  private BigDecimal price;
  @Column(name = "fee", nullable = true)
  private BigDecimal fee;
  @Column(name = "executed_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant executedAt;
  @PrePersist
  void onCreate() {
    if (tradeId == null) {
      tradeId = UUID.randomUUID();
    }
    if (executedAt == null) {
      executedAt = Instant.now();
    }
  }
}
