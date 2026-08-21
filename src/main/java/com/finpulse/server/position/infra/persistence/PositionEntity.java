package com.finpulse.server.position.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import java.math.BigDecimal;
import java.time.LocalDate;
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
public class PositionEntity {
  @Id
  @Column(name = "position_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID positionId;
  @Column(name = "portfolio_id", nullable = false)
  private UUID portfolioId;
  @Column(name = "instrument_id", nullable = false)
  private UUID instrumentId;
  @Column(name = "quantity", nullable = false)
  private BigDecimal quantity;
  @Column(name = "cost_basis", nullable = true)
  private BigDecimal costBasis;
  @Column(name = "as_of_date", nullable = false)
  @Setter(AccessLevel.NONE)
  private LocalDate asOfDate;
  @PrePersist
  void onCreate() {
    if (positionId == null) {
      positionId = UUID.randomUUID();
    }
    if (asOfDate == null) {
      asOfDate = LocalDate.now();
    }
  }
}
