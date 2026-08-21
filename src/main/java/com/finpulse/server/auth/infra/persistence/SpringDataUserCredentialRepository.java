package com.finpulse.server.auth.infra.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataUserCredentialRepository
    extends JpaRepository<UserCredentialEntity, UUID> {
  Optional<UserCredentialEntity> findByEmail(String email);

  Optional<UserCredentialEntity> findByCustomerId(UUID customerId);
}
