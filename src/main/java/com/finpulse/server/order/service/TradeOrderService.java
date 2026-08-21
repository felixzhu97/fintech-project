package com.finpulse.server.order.service;

import com.finpulse.server.order.domain.model.TradeOrder;
import com.finpulse.server.order.domain.repository.TradeOrderRepository;
import com.finpulse.server.order.dto.TradeOrderRequest;
import com.finpulse.server.order.mapper.TradeOrderMapper;
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
public class TradeOrderService {
  private final TradeOrderRepository repository;
  private final TradeOrderMapper mapper;

  @Transactional(readOnly = true)
  public List<TradeOrder> list(int limit, int offset) { return repository.findAll(limit, offset); }

  @Transactional(readOnly = true)
  public TradeOrder getById(UUID id) {
    return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TradeOrder not found"));
  }

  public TradeOrder create(TradeOrderRequest request) { return repository.save(mapper.toDomain(request)); }
  public List<TradeOrder> createBatch(List<TradeOrderRequest> requests) { return requests.stream().map(this::create).toList(); }
  public TradeOrder update(UUID id, TradeOrderRequest request) {
    TradeOrder existing = getById(id); mapper.apply(request, existing); return repository.save(existing);
  }
  public void delete(UUID id) {
    if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TradeOrder not found");
    repository.deleteById(id);
  }
}
