package com.finpulse.server.position.infra.persistence;

import com.finpulse.server.position.domain.model.Position;
import com.finpulse.server.position.domain.repository.PositionRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PositionRepositoryImpl implements PositionRepository {
  private final SpringDataPositionRepository springData;

  @Override
  public List<Position> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("asOfDate").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<Position> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public Position save(Position entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private Position toDomain(PositionEntity e) { return Position.rehydrate(e.getPositionId(), e.getPortfolioId(), e.getInstrumentId(), e.getQuantity(), e.getCostBasis(), e.getAsOfDate()); }

  private PositionEntity toEntity(Position d) {
    return PositionEntity.builder()
        .positionId(d.positionId())
        .portfolioId(d.portfolioId())
        .instrumentId(d.instrumentId())
        .quantity(d.quantity())
        .costBasis(d.costBasis())
        .asOfDate(d.asOfDate())
        .build();
  }
}
