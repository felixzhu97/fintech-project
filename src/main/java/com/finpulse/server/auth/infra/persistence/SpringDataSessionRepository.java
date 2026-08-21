package com.finpulse.server.auth.infra.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataSessionRepository extends JpaRepository<SessionEntity, UUID> {
  Optional<SessionEntity> findByToken(String token);

  void deleteByToken(String token);
}
