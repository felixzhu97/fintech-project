package com.finpulse.server.preference.infra.persistence;

import com.finpulse.server.preference.domain.model.UserPreference;
import com.finpulse.server.preference.domain.repository.UserPreferenceRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserPreferenceRepositoryImpl implements UserPreferenceRepository {
  private final SpringDataUserPreferenceRepository springData;

  @Override
  public List<UserPreference> findAllOrderedByUpdatedAt(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("updatedAt")).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<UserPreference> findById(UUID preferenceId) {
    return springData.findById(preferenceId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID preferenceId) {
    return springData.existsById(preferenceId);
  }

  @Override
  public UserPreference save(UserPreference preference) {
    UserPreferenceEntity entity = toEntity(preference);
    return toDomain(springData.save(entity));
  }

  @Override
  public void deleteById(UUID preferenceId) {
    springData.deleteById(preferenceId);
  }

  private UserPreference toDomain(UserPreferenceEntity entity) {
    return UserPreference.rehydrate(
        entity.getPreferenceId(),
        entity.getCustomerId(),
        entity.getTheme(),
        entity.getLanguage(),
        entity.isNotificationsEnabled(),
        entity.getUpdatedAt());
  }

  private UserPreferenceEntity toEntity(UserPreference preference) {
    return UserPreferenceEntity.builder()
        .preferenceId(preference.preferenceId())
        .customerId(preference.customerId())
        .theme(preference.theme())
        .language(preference.language())
        .notificationsEnabled(preference.notificationsEnabled())
        .updatedAt(preference.updatedAt())
        .build();
  }
}
