package com.finpulse.server.cashtransaction.infra.persistence;

import com.finpulse.server.cashtransaction.domain.model.CashTransaction;
import com.finpulse.server.cashtransaction.domain.repository.CashTransactionRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CashTransactionRepositoryImpl implements CashTransactionRepository {
  private final SpringDataCashTransactionRepository springData;

  @Override
  public List<CashTransaction> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<CashTransaction> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public CashTransaction save(CashTransaction entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private CashTransaction toDomain(CashTransactionEntity e) { return CashTransaction.rehydrate(e.getTransactionId(), e.getAccountId(), e.getType(), e.getAmount(), e.getCurrency(), e.getStatus(), e.getCreatedAt()); }

  private CashTransactionEntity toEntity(CashTransaction d) {
    return CashTransactionEntity.builder()
        .transactionId(d.transactionId())
        .accountId(d.accountId())
        .type(d.type())
        .amount(d.amount())
        .currency(d.currency())
        .status(d.status())
        .createdAt(d.createdAt())
        .build();
  }
}
