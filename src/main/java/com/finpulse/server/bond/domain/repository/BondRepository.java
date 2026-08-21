package com.finpulse.server.bond.domain.repository;

import com.finpulse.server.bond.domain.model.Bond;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BondRepository {
  List<Bond> findAll(int limit, int offset);
  Optional<Bond> findById(UUID id);
  boolean existsById(UUID id);
  Bond save(Bond entity);
  void deleteById(UUID id);
}
