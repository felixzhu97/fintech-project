package com.finpulse.server.bond.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bond")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BondEntity {
  @Id
  @Column(name = "bond_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID bondId;
  @Column(name = "instrument_id", nullable = false)
  private UUID instrumentId;
  @Column(name = "face_value", nullable = true)
  private BigDecimal faceValue;
  @Column(name = "coupon_rate", nullable = true)
  private BigDecimal couponRate;
  @Column(name = "ytm", nullable = true)
  private BigDecimal ytm;
  @Column(name = "duration", nullable = true)
  private BigDecimal duration;
  @Column(name = "convexity", nullable = true)
  private BigDecimal convexity;
  @Column(name = "maturity_years", nullable = true)
  private BigDecimal maturityYears;
  @Column(name = "frequency", nullable = true)
  private Integer frequency;

  @PrePersist
  void onCreate() {
    if (bondId == null) {
      bondId = UUID.randomUUID();
    }
  }
}
