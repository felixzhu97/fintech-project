package com.finpulse.server.marketdata.domain.model;

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
public final class MarketData {
  @NonNull private final UUID dataId;
  @NonNull private UUID instrumentId;
  @NonNull private Instant timestamp;
  private BigDecimal open;
  private BigDecimal high;
  private BigDecimal low;
  @NonNull private BigDecimal close;
  private BigDecimal volume;
  private BigDecimal changePct;

  public static MarketData create(
      UUID instrumentId,
      Instant timestamp,
      BigDecimal open,
      BigDecimal high,
      BigDecimal low,
      BigDecimal close,
      BigDecimal volume,
      BigDecimal changePct) {
    return new MarketData(
        UUID.randomUUID(),
        instrumentId,
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        changePct);
  }

  public static MarketData rehydrate(
      UUID dataId,
      UUID instrumentId,
      Instant timestamp,
      BigDecimal open,
      BigDecimal high,
      BigDecimal low,
      BigDecimal close,
      BigDecimal volume,
      BigDecimal changePct) {
    return new MarketData(
        dataId, instrumentId, timestamp, open, high, low, close, volume, changePct);
  }

  public void update(
      @NonNull UUID instrumentId,
      @NonNull Instant timestamp,
      BigDecimal open,
      BigDecimal high,
      BigDecimal low,
      @NonNull BigDecimal close,
      BigDecimal volume,
      BigDecimal changePct) {
    this.instrumentId = instrumentId;
    this.timestamp = timestamp;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
    this.changePct = changePct;
  }
}
