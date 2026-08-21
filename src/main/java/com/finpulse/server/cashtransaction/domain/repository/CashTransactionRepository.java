package com.finpulse.server.cashtransaction.domain.repository;

import com.finpulse.server.cashtransaction.domain.model.CashTransaction;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CashTransactionRepository {
  List<CashTransaction> findAll(int limit, int offset);
  Optional<CashTransaction> findById(UUID id);
  boolean existsById(UUID id);
  CashTransaction save(CashTransaction entity);
  void deleteById(UUID id);
}
