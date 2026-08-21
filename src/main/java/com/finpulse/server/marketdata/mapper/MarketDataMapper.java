package com.finpulse.server.marketdata.mapper;

import com.finpulse.server.marketdata.domain.model.MarketData;
import com.finpulse.server.marketdata.dto.MarketDataRequest;
import com.finpulse.server.marketdata.dto.MarketDataResponse;
import org.springframework.stereotype.Component;

@Component
public class MarketDataMapper {
  public MarketData toDomain(MarketDataRequest request) {
    return MarketData.create(
        request.getInstrumentId(),
        request.getTimestamp(),
        request.getOpen(),
        request.getHigh(),
        request.getLow(),
        request.getClose(),
        request.getVolume(),
        request.getChangePct());
  }

  public void apply(MarketDataRequest request, MarketData marketData) {
    marketData.update(
        request.getInstrumentId(),
        request.getTimestamp(),
        request.getOpen(),
        request.getHigh(),
        request.getLow(),
        request.getClose(),
        request.getVolume(),
        request.getChangePct());
  }

  public MarketDataResponse toResponse(MarketData marketData) {
    return MarketDataResponse.builder()
        .dataId(marketData.dataId())
        .instrumentId(marketData.instrumentId())
        .timestamp(marketData.timestamp())
        .open(marketData.open())
        .high(marketData.high())
        .low(marketData.low())
        .close(marketData.close())
        .volume(marketData.volume())
        .changePct(marketData.changePct())
        .build();
  }
}
