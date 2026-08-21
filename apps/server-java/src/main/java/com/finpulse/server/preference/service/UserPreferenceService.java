package com.finpulse.server.preference.service;

import com.finpulse.server.preference.domain.UserPreference;
import com.finpulse.server.preference.dto.UserPreferenceRequest;
import com.finpulse.server.preference.repository.UserPreferenceRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserPreferenceService {
  private final UserPreferenceRepository repository;

  @Transactional(readOnly = true)
  public List<UserPreference> list(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return repository.findAll(Sort.by("updatedAt")).stream()
        .skip(start)
        .limit(size)
        .toList();
  }

  @Transactional(readOnly = true)
  public UserPreference getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User preference not found"));
  }

  public UserPreference create(UserPreferenceRequest request) {
    UserPreference entity =
        UserPreference.builder()
            .preferenceId(UUID.randomUUID())
            .customerId(request.getCustomerId())
            .theme(request.getTheme())
            .language(request.getLanguage())
            .notificationsEnabled(request.isNotificationsEnabled())
            .build();
    return repository.save(entity);
  }

  public List<UserPreference> createBatch(List<UserPreferenceRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public UserPreference update(UUID id, UserPreferenceRequest request) {
    UserPreference existing = getById(id);
    existing.setCustomerId(request.getCustomerId());
    existing.setTheme(request.getTheme());
    existing.setLanguage(request.getLanguage());
    existing.setNotificationsEnabled(request.isNotificationsEnabled());
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User preference not found");
    }
    repository.deleteById(id);
  }
}
