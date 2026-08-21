package com.finpulse.server.marketdata.infra.persistence;

import com.finpulse.server.marketdata.domain.model.MarketData;
import com.finpulse.server.marketdata.domain.repository.MarketDataRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MarketDataRepositoryImpl implements MarketDataRepository {
  private final SpringDataMarketDataRepository springData;

  @Override
  public List<MarketData> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("timestamp")).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<MarketData> findById(UUID dataId) {
    return springData.findById(dataId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID dataId) {
    return springData.existsById(dataId);
  }

  @Override
  public MarketData save(MarketData marketData) {
    return toDomain(springData.save(toEntity(marketData)));
  }

  @Override
  public void deleteById(UUID dataId) {
    springData.deleteById(dataId);
  }

  private MarketData toDomain(MarketDataEntity e) {
    return MarketData.rehydrate(
        e.getDataId(),
        e.getInstrumentId(),
        e.getTimestamp(),
        e.getOpen(),
        e.getHigh(),
        e.getLow(),
        e.getClose(),
        e.getVolume(),
        e.getChangePct());
  }

  private MarketDataEntity toEntity(MarketData m) {
    return MarketDataEntity.builder()
        .dataId(m.dataId())
        .instrumentId(m.instrumentId())
        .timestamp(m.timestamp())
        .open(m.open())
        .high(m.high())
        .low(m.low())
        .close(m.close())
        .volume(m.volume())
        .changePct(m.changePct())
        .build();
  }
}
