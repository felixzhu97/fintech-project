package com.finpulse.server.order.infra.persistence;

import com.finpulse.server.order.domain.model.TradeOrder;
import com.finpulse.server.order.domain.repository.TradeOrderRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TradeOrderRepositoryImpl implements TradeOrderRepository {
  private final SpringDataTradeOrderRepository springData;

  @Override
  public List<TradeOrder> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<TradeOrder> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public TradeOrder save(TradeOrder entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private TradeOrder toDomain(TradeOrderEntity e) { return TradeOrder.rehydrate(e.getOrderId(), e.getAccountId(), e.getInstrumentId(), e.getSide(), e.getQuantity(), e.getOrderType(), e.getStatus(), e.getCreatedAt()); }

  private TradeOrderEntity toEntity(TradeOrder d) {
    return TradeOrderEntity.builder()
        .orderId(d.orderId())
        .accountId(d.accountId())
        .instrumentId(d.instrumentId())
        .side(d.side())
        .quantity(d.quantity())
        .orderType(d.orderType())
        .status(d.status())
        .createdAt(d.createdAt())
        .build();
  }
}
