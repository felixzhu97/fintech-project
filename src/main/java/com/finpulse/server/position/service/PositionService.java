package com.finpulse.server.position.service;

import com.finpulse.server.position.domain.model.Position;
import com.finpulse.server.position.domain.repository.PositionRepository;
import com.finpulse.server.position.dto.PositionRequest;
import com.finpulse.server.position.mapper.PositionMapper;
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
public class PositionService {
  private final PositionRepository repository;
  private final PositionMapper mapper;

  @Transactional(readOnly = true)
  public List<Position> list(int limit, int offset) { return repository.findAll(limit, offset); }

  @Transactional(readOnly = true)
  public Position getById(UUID id) {
    return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
  }

  public Position create(PositionRequest request) { return repository.save(mapper.toDomain(request)); }
  public List<Position> createBatch(List<PositionRequest> requests) { return requests.stream().map(this::create).toList(); }
  public Position update(UUID id, PositionRequest request) {
    Position existing = getById(id); mapper.apply(request, existing); return repository.save(existing);
  }
  public void delete(UUID id) {
    if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found");
    repository.deleteById(id);
  }
}
