package com.finpulse.server.marketdata.infra.persistence;

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
public class MarketDataEntity {
  @Id
  @Column(name = "data_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID dataId;

  @Column(name = "instrument_id", nullable = false)
  private UUID instrumentId;

  @Column(nullable = false)
  private Instant timestamp;

  private BigDecimal open;

  private BigDecimal high;

  private BigDecimal low;

  @Column(nullable = false)
  private BigDecimal close;

  private BigDecimal volume;

  @Column(name = "change_pct")
  private BigDecimal changePct;

  @PrePersist
  void onCreate() {
    if (dataId == null) {
      dataId = UUID.randomUUID();
    }
  }
}
