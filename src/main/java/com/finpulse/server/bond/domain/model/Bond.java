package com.finpulse.server.bond.domain.model;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Bond {
  @NonNull private final UUID bondId;
  @NonNull private UUID instrumentId;
  private BigDecimal faceValue;
  private BigDecimal couponRate;
  private BigDecimal ytm;
  private BigDecimal duration;
  private BigDecimal convexity;
  private BigDecimal maturityYears;
  private Integer frequency;

  public static Bond create(UUID instrumentId, BigDecimal faceValue, BigDecimal couponRate, BigDecimal ytm, BigDecimal duration, BigDecimal convexity, BigDecimal maturityYears, Integer frequency) {
    return new Bond(UUID.randomUUID(), instrumentId, faceValue, couponRate, ytm, duration, convexity, maturityYears, frequency);
  }

  public static Bond rehydrate(UUID bondId, UUID instrumentId, BigDecimal faceValue, BigDecimal couponRate, BigDecimal ytm, BigDecimal duration, BigDecimal convexity, BigDecimal maturityYears, Integer frequency) {
    return new Bond(bondId, instrumentId, faceValue, couponRate, ytm, duration, convexity, maturityYears, frequency);
  }

  public void update(@NonNull UUID instrumentId, BigDecimal faceValue, BigDecimal couponRate, BigDecimal ytm, BigDecimal duration, BigDecimal convexity, BigDecimal maturityYears, Integer frequency) {
    this.instrumentId = instrumentId;
    this.faceValue = faceValue;
    this.couponRate = couponRate;
    this.ytm = ytm;
    this.duration = duration;
    this.convexity = convexity;
    this.maturityYears = maturityYears;
    this.frequency = frequency;
  }
}
