package com.finpulse.server.instrument.domain.model;

import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Instrument {
  @NonNull private final UUID instrumentId;
  @NonNull private String symbol;
  private String name;
  private String assetClass;
  private String currency;
  private String exchange;

  public static Instrument create(String symbol, String name, String assetClass, String currency, String exchange) {
    return new Instrument(UUID.randomUUID(), symbol, name, assetClass, currency, exchange);
  }

  public static Instrument rehydrate(UUID instrumentId, String symbol, String name, String assetClass, String currency, String exchange) {
    return new Instrument(instrumentId, symbol, name, assetClass, currency, exchange);
  }

  public void update(@NonNull String symbol, String name, String assetClass, String currency, String exchange) {
    this.symbol = symbol;
    this.name = name;
    this.assetClass = assetClass;
    this.currency = currency;
    this.exchange = exchange;
  }
}
