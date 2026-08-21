package com.finpulse.server.settlement.infra.persistence;

import com.finpulse.server.settlement.domain.model.Settlement;
import com.finpulse.server.settlement.domain.repository.SettlementRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SettlementRepositoryImpl implements SettlementRepository {
  private final SpringDataSettlementRepository springData;

  @Override
  public List<Settlement> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("settlementId").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<Settlement> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public Settlement save(Settlement entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private Settlement toDomain(SettlementEntity e) { return Settlement.rehydrate(e.getSettlementId(), e.getTradeId(), e.getPaymentId(), e.getStatus(), e.getSettledAt()); }

  private SettlementEntity toEntity(Settlement d) {
    return SettlementEntity.builder()
        .settlementId(d.settlementId())
        .tradeId(d.tradeId())
        .paymentId(d.paymentId())
        .status(d.status())
        .settledAt(d.settledAt())
        .build();
  }
}
