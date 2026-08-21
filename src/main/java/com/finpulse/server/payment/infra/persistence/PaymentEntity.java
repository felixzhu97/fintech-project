package com.finpulse.server.payment.infra.persistence;

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
public class PaymentEntity {
  @Id
  @Column(name = "payment_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID paymentId;
  @Column(name = "account_id", nullable = false)
  private UUID accountId;
  @Column(name = "counterparty", nullable = true)
  private String counterparty;
  @Column(name = "amount", nullable = false)
  private BigDecimal amount;
  @Column(name = "currency", nullable = false)
  private String currency;
  @Column(name = "status", nullable = false)
  private String status;
  @Column(name = "created_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant createdAt;
  @PrePersist
  void onCreate() {
    if (paymentId == null) {
      paymentId = UUID.randomUUID();
    }
    if (status == null) {
      status = "pending";
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
