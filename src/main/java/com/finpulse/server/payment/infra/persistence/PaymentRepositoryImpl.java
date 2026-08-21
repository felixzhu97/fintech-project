package com.finpulse.server.payment.infra.persistence;

import com.finpulse.server.payment.domain.model.Payment;
import com.finpulse.server.payment.domain.repository.PaymentRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl implements PaymentRepository {
  private final SpringDataPaymentRepository springData;

  @Override
  public List<Payment> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream().skip(start).limit(size).map(this::toDomain).toList();
  }

  @Override
  public Optional<Payment> findById(UUID id) { return springData.findById(id).map(this::toDomain); }

  @Override
  public boolean existsById(UUID id) { return springData.existsById(id); }

  @Override
  public Payment save(Payment entity) { return toDomain(springData.save(toEntity(entity))); }

  @Override
  public void deleteById(UUID id) { springData.deleteById(id); }

  private Payment toDomain(PaymentEntity e) { return Payment.rehydrate(e.getPaymentId(), e.getAccountId(), e.getCounterparty(), e.getAmount(), e.getCurrency(), e.getStatus(), e.getCreatedAt()); }

  private PaymentEntity toEntity(Payment d) {
    return PaymentEntity.builder()
        .paymentId(d.paymentId())
        .accountId(d.accountId())
        .counterparty(d.counterparty())
        .amount(d.amount())
        .currency(d.currency())
        .status(d.status())
        .createdAt(d.createdAt())
        .build();
  }
}
