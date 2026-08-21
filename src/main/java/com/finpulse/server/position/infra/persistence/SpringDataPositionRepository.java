package com.finpulse.server.position.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPositionRepository extends JpaRepository<PositionEntity, UUID> {}
