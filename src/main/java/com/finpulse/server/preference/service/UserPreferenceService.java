package com.finpulse.server.preference.service;

import com.finpulse.server.preference.domain.model.UserPreference;
import com.finpulse.server.preference.domain.repository.UserPreferenceRepository;
import com.finpulse.server.preference.dto.UserPreferenceRequest;
import com.finpulse.server.preference.mapper.UserPreferenceMapper;
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
public class UserPreferenceService {
  private final UserPreferenceRepository repository;
  private final UserPreferenceMapper mapper;

  @Transactional(readOnly = true)
  public List<UserPreference> list(int limit, int offset) {
    return repository.findAllOrderedByUpdatedAt(limit, offset);
  }

  @Transactional(readOnly = true)
  public UserPreference getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User preference not found"));
  }

  public UserPreference create(UserPreferenceRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<UserPreference> createBatch(List<UserPreferenceRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public UserPreference update(UUID id, UserPreferenceRequest request) {
    UserPreference existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User preference not found");
    }
    repository.deleteById(id);
  }
}
