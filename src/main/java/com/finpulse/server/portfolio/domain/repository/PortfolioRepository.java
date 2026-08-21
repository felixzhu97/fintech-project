package com.finpulse.server.portfolio.domain.repository;

import com.finpulse.server.portfolio.domain.model.Portfolio;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PortfolioRepository {
  List<Portfolio> findAll(int limit, int offset);
  Optional<Portfolio> findById(UUID id);
  boolean existsById(UUID id);
  Portfolio save(Portfolio entity);
  void deleteById(UUID id);
}
