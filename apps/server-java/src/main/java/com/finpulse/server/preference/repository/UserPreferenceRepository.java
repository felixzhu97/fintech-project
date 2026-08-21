package com.finpulse.server.preference.repository;

import com.finpulse.server.preference.domain.UserPreference;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {}
