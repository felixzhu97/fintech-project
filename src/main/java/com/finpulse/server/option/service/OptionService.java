package com.finpulse.server.option.service;

import com.finpulse.server.option.domain.model.Option;
import com.finpulse.server.option.domain.repository.OptionRepository;
import com.finpulse.server.option.dto.OptionRequest;
import com.finpulse.server.option.mapper.OptionMapper;
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
public class OptionService {
  private final OptionRepository repository;
  private final OptionMapper mapper;

  @Transactional(readOnly = true)
  public List<Option> list(int limit, int offset) {
    return repository.findAll(limit, offset);
  }

  @Transactional(readOnly = true)
  public Option getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found"));
  }

  public Option create(OptionRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<Option> createBatch(List<OptionRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public Option update(UUID id, OptionRequest request) {
    Option existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found");
    }
    repository.deleteById(id);
  }
}
