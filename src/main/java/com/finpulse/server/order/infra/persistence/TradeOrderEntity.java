package com.finpulse.server.order.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
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
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TradeOrderEntity {
  @Id
  @Column(name = "order_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID orderId;
  @Column(name = "account_id", nullable = false)
  private UUID accountId;
  @Column(name = "instrument_id", nullable = false)
  private UUID instrumentId;
  @Column(name = "side", nullable = false)
  private String side;
  @Column(name = "quantity", nullable = false)
  private BigDecimal quantity;
  @Column(name = "order_type", nullable = false)
  private String orderType;
  @Column(name = "status", nullable = false)
  private String status;
  @Column(name = "created_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant createdAt;
  @PrePersist
  void onCreate() {
    if (orderId == null) {
      orderId = UUID.randomUUID();
    }
    if (status == null) {
      status = "pending";
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
