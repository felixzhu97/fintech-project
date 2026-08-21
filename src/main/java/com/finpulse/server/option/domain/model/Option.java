package com.finpulse.server.option.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Option {
  @NonNull private final UUID optionId;
  @NonNull private UUID instrumentId;
  @NonNull private UUID underlyingInstrumentId;
  @NonNull private BigDecimal strike;
  @NonNull private Instant expiry;
  @NonNull private String optionType;
  private BigDecimal riskFreeRate;
  private BigDecimal volatility;
  private BigDecimal bsPrice;
  private BigDecimal delta;
  private BigDecimal gamma;
  private BigDecimal theta;
  private BigDecimal vega;
  private BigDecimal rho;
  private BigDecimal impliedVolatility;

  public static Option create(
      UUID instrumentId,
      UUID underlyingInstrumentId,
      BigDecimal strike,
      Instant expiry,
      String optionType,
      BigDecimal riskFreeRate,
      BigDecimal volatility,
      BigDecimal bsPrice,
      BigDecimal delta,
      BigDecimal gamma,
      BigDecimal theta,
      BigDecimal vega,
      BigDecimal rho,
      BigDecimal impliedVolatility) {
    return new Option(
        UUID.randomUUID(),
        instrumentId,
        underlyingInstrumentId,
        strike,
        expiry,
        optionType,
        riskFreeRate,
        volatility,
        bsPrice,
        delta,
        gamma,
        theta,
        vega,
        rho,
        impliedVolatility);
  }

  public static Option rehydrate(
      UUID optionId,
      UUID instrumentId,
      UUID underlyingInstrumentId,
      BigDecimal strike,
      Instant expiry,
      String optionType,
      BigDecimal riskFreeRate,
      BigDecimal volatility,
      BigDecimal bsPrice,
      BigDecimal delta,
      BigDecimal gamma,
      BigDecimal theta,
      BigDecimal vega,
      BigDecimal rho,
      BigDecimal impliedVolatility) {
    return new Option(
        optionId,
        instrumentId,
        underlyingInstrumentId,
        strike,
        expiry,
        optionType,
        riskFreeRate,
        volatility,
        bsPrice,
        delta,
        gamma,
        theta,
        vega,
        rho,
        impliedVolatility);
  }

  public void update(
      @NonNull UUID instrumentId,
      @NonNull UUID underlyingInstrumentId,
      @NonNull BigDecimal strike,
      @NonNull Instant expiry,
      @NonNull String optionType,
      BigDecimal riskFreeRate,
      BigDecimal volatility,
      BigDecimal bsPrice,
      BigDecimal delta,
      BigDecimal gamma,
      BigDecimal theta,
      BigDecimal vega,
      BigDecimal rho,
      BigDecimal impliedVolatility) {
    this.instrumentId = instrumentId;
    this.underlyingInstrumentId = underlyingInstrumentId;
    this.strike = strike;
    this.expiry = expiry;
    this.optionType = optionType;
    this.riskFreeRate = riskFreeRate;
    this.volatility = volatility;
    this.bsPrice = bsPrice;
    this.delta = delta;
    this.gamma = gamma;
    this.theta = theta;
    this.vega = vega;
    this.rho = rho;
    this.impliedVolatility = impliedVolatility;
  }
}
