package com.finpulse.server.settlement.domain.repository;

import com.finpulse.server.settlement.domain.model.Settlement;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SettlementRepository {
  List<Settlement> findAll(int limit, int offset);
  Optional<Settlement> findById(UUID id);
  boolean existsById(UUID id);
  Settlement save(Settlement entity);
  void deleteById(UUID id);
}
