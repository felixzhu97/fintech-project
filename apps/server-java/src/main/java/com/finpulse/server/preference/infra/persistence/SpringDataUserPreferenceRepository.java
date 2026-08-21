package com.finpulse.server.preference.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataUserPreferenceRepository
    extends JpaRepository<UserPreferenceEntity, UUID> {}
