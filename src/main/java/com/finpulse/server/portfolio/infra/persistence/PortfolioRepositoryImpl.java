package com.finpulse.server.portfolio.infra.persistence;

import com.finpulse.server.portfolio.domain.model.Portfolio;
import com.finpulse.server.portfolio.domain.repository.PortfolioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PortfolioRepositoryImpl implements PortfolioRepository {
  private final SpringDataPortfolioRepository springData;

  @Override
  public List<Portfolio> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<Portfolio> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public Portfolio save(Portfolio entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private Portfolio toDomain(PortfolioEntity e) { return Portfolio.rehydrate(e.getPortfolioId(), e.getAccountId(), e.getName(), e.getBaseCurrency(), e.getCreatedAt()); }

  private PortfolioEntity toEntity(Portfolio d) {
    return PortfolioEntity.builder()
        .portfolioId(d.portfolioId())
        .accountId(d.accountId())
        .name(d.name())
        .baseCurrency(d.baseCurrency())
        .createdAt(d.createdAt())
        .build();
  }
}
