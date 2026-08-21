package com.finpulse.server.instrument.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "instrument")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class InstrumentEntity {
  @Id
  @Column(name = "instrument_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID instrumentId;
  @Column(name = "symbol", nullable = false)
  private String symbol;
  @Column(name = "name", nullable = true)
  private String name;
  @Column(name = "asset_class", nullable = true)
  private String assetClass;
  @Column(name = "currency", nullable = true)
  private String currency;
  @Column(name = "exchange", nullable = true)
  private String exchange;

  @PrePersist
  void onCreate() {
    if (instrumentId == null) {
      instrumentId = UUID.randomUUID();
    }
  }
}
