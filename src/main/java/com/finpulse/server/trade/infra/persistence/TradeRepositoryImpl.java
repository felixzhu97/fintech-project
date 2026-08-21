package com.finpulse.server.trade.infra.persistence;

import com.finpulse.server.trade.domain.model.Trade;
import com.finpulse.server.trade.domain.repository.TradeRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TradeRepositoryImpl implements TradeRepository {
  private final SpringDataTradeRepository springData;

  @Override
  public List<Trade> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("executedAt").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<Trade> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public Trade save(Trade entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private Trade toDomain(TradeEntity e) { return Trade.rehydrate(e.getTradeId(), e.getOrderId(), e.getQuantity(), e.getPrice(), e.getFee(), e.getExecutedAt()); }

  private TradeEntity toEntity(Trade d) {
    return TradeEntity.builder()
        .tradeId(d.tradeId())
        .orderId(d.orderId())
        .quantity(d.quantity())
        .price(d.price())
        .fee(d.fee())
        .executedAt(d.executedAt())
        .build();
  }
}
