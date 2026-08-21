package com.finpulse.server.preference.domain.repository;

import com.finpulse.server.preference.domain.model.UserPreference;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPreferenceRepository {
  List<UserPreference> findAllOrderedByUpdatedAt(int limit, int offset);

  Optional<UserPreference> findById(UUID preferenceId);

  boolean existsById(UUID preferenceId);

  UserPreference save(UserPreference preference);

  void deleteById(UUID preferenceId);
}
