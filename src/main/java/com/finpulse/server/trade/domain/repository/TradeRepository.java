package com.finpulse.server.trade.domain.repository;

import com.finpulse.server.trade.domain.model.Trade;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TradeRepository {
  List<Trade> findAll(int limit, int offset);
  Optional<Trade> findById(UUID id);
  boolean existsById(UUID id);
  Trade save(Trade entity);
  void deleteById(UUID id);
}
