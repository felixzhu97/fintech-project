package com.finpulse.server.settlement.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "settlement")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SettlementEntity {
  @Id
  @Column(name = "settlement_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID settlementId;
  @Column(name = "trade_id", nullable = false)
  private UUID tradeId;
  @Column(name = "payment_id", nullable = false)
  private UUID paymentId;
  @Column(name = "status", nullable = false)
  private String status;
  @Column(name = "settled_at", nullable = true)
  private Instant settledAt;
  @PrePersist
  void onCreate() {
    if (settlementId == null) {
      settlementId = UUID.randomUUID();
    }
    if (status == null) {
      status = "pending";
    }
  }
}
