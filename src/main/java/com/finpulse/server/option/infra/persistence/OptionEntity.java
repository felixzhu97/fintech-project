package com.finpulse.server.option.infra.persistence;

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
public class OptionEntity {
  @Id
  @Column(name = "option_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID optionId;

  @Column(name = "instrument_id", nullable = false, unique = true)
  private UUID instrumentId;

  @Column(name = "underlying_instrument_id", nullable = false)
  private UUID underlyingInstrumentId;

  @Column(nullable = false)
  private BigDecimal strike;

  @Column(nullable = false)
  private Instant expiry;

  @Column(name = "option_type", nullable = false)
  private String optionType;

  @Column(name = "risk_free_rate")
  private BigDecimal riskFreeRate;

  private BigDecimal volatility;

  @Column(name = "bs_price")
  private BigDecimal bsPrice;

  private BigDecimal delta;

  private BigDecimal gamma;

  private BigDecimal theta;

  private BigDecimal vega;

  private BigDecimal rho;

  @Column(name = "implied_volatility")
  private BigDecimal impliedVolatility;

  @PrePersist
  void onCreate() {
    if (optionId == null) {
      optionId = UUID.randomUUID();
    }
  }
}
