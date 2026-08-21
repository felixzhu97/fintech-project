package com.finpulse.server.account.infra.persistence;

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
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AccountEntity {
  @Id
  @Column(name = "account_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID accountId;

  @Column(name = "customer_id", nullable = false)
  private UUID customerId;

  @Column(name = "account_type", nullable = false)
  private String accountType;

  @Column(nullable = false)
  private String currency;

  @Column(nullable = false)
  private String status;

  @Column(name = "opened_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant openedAt;

  @PrePersist
  void onCreate() {
    if (accountId == null) {
      accountId = UUID.randomUUID();
    }
    if (openedAt == null) {
      openedAt = Instant.now();
    }
    if (status == null) {
      status = "active";
    }
  }
}
