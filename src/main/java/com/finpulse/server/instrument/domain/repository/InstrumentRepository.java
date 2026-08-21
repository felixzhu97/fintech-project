package com.finpulse.server.instrument.domain.repository;

import com.finpulse.server.instrument.domain.model.Instrument;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InstrumentRepository {
  List<Instrument> findAll(int limit, int offset);
  Optional<Instrument> findById(UUID id);
  boolean existsById(UUID id);
  Instrument save(Instrument entity);
  void deleteById(UUID id);
}
