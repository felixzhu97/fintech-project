package com.finpulse.server.order.domain.repository;

import com.finpulse.server.order.domain.model.TradeOrder;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TradeOrderRepository {
  List<TradeOrder> findAll(int limit, int offset);
  Optional<TradeOrder> findById(UUID id);
  boolean existsById(UUID id);
  TradeOrder save(TradeOrder entity);
  void deleteById(UUID id);
}
