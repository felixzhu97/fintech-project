package com.finpulse.server.payment.domain.repository;

import com.finpulse.server.payment.domain.model.Payment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {
  List<Payment> findAll(int limit, int offset);
  Optional<Payment> findById(UUID id);
  boolean existsById(UUID id);
  Payment save(Payment entity);
  void deleteById(UUID id);
}
