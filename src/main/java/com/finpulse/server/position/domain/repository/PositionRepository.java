package com.finpulse.server.position.domain.repository;

import com.finpulse.server.position.domain.model.Position;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PositionRepository {
  List<Position> findAll(int limit, int offset);
  Optional<Position> findById(UUID id);
  boolean existsById(UUID id);
  Position save(Position entity);
  void deleteById(UUID id);
}
