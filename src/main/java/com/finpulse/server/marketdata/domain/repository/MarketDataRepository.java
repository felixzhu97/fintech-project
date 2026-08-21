package com.finpulse.server.marketdata.domain.repository;

import com.finpulse.server.marketdata.domain.model.MarketData;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MarketDataRepository {
  List<MarketData> findAll(int limit, int offset);

  Optional<MarketData> findById(UUID dataId);

  boolean existsById(UUID dataId);

  MarketData save(MarketData marketData);

  void deleteById(UUID dataId);
}
