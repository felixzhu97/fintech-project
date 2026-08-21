package com.finpulse.server.bond.service;

import com.finpulse.server.bond.domain.model.Bond;
import com.finpulse.server.bond.domain.repository.BondRepository;
import com.finpulse.server.bond.dto.BondRequest;
import com.finpulse.server.bond.mapper.BondMapper;
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
public class BondService {
  private final BondRepository repository;
  private final BondMapper mapper;

  @Transactional(readOnly = true)
  public List<Bond> list(int limit, int offset) {
    return repository.findAll(limit, offset);
  }

  @Transactional(readOnly = true)
  public Bond getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bond not found"));
  }

  public Bond create(BondRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<Bond> createBatch(List<BondRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public Bond update(UUID id, BondRequest request) {
    Bond existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bond not found");
    }
    repository.deleteById(id);
  }
}
