package com.finpulse.server.payment.service;

import com.finpulse.server.payment.domain.model.Payment;
import com.finpulse.server.payment.domain.repository.PaymentRepository;
import com.finpulse.server.payment.dto.PaymentRequest;
import com.finpulse.server.payment.mapper.PaymentMapper;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {
  private final PaymentRepository repository;
  private final PaymentMapper mapper;

  @Transactional(readOnly = true)
  public List<Payment> list(int limit, int offset) { return repository.findAll(limit, offset); }

  @Transactional(readOnly = true)
  public Payment getById(UUID id) {
    return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
  }

  public Payment create(PaymentRequest request) { return repository.save(mapper.toDomain(request)); }
  public List<Payment> createBatch(List<PaymentRequest> requests) { return requests.stream().map(this::create).toList(); }
  public Payment update(UUID id, PaymentRequest request) {
    Payment existing = getById(id); mapper.apply(request, existing); return repository.save(existing);
  }
  public void delete(UUID id) {
    if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
    repository.deleteById(id);
  }
}
