package com.finpulse.server.portfolio.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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
public class PortfolioEntity {
  @Id
  @Column(name = "portfolio_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID portfolioId;
  @Column(name = "account_id", nullable = false)
  private UUID accountId;
  @Column(name = "name", nullable = false)
  private String name;
  @Column(name = "base_currency", nullable = false)
  private String baseCurrency;
  @Column(name = "created_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant createdAt;
  @PrePersist
  void onCreate() {
    if (portfolioId == null) {
      portfolioId = UUID.randomUUID();
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
