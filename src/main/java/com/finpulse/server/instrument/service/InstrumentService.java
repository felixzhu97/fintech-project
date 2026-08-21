package com.finpulse.server.instrument.service;

import com.finpulse.server.instrument.domain.model.Instrument;
import com.finpulse.server.instrument.domain.repository.InstrumentRepository;
import com.finpulse.server.instrument.dto.InstrumentRequest;
import com.finpulse.server.instrument.mapper.InstrumentMapper;
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
public class InstrumentService {
  private final InstrumentRepository repository;
  private final InstrumentMapper mapper;

  @Transactional(readOnly = true)
  public List<Instrument> list(int limit, int offset) {
    return repository.findAll(limit, offset);
  }

  @Transactional(readOnly = true)
  public Instrument getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Instrument not found"));
  }

  public Instrument create(InstrumentRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<Instrument> createBatch(List<InstrumentRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public Instrument update(UUID id, InstrumentRequest request) {
    Instrument existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Instrument not found");
    }
    repository.deleteById(id);
  }
}
