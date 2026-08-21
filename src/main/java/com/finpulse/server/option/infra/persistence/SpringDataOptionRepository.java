package com.finpulse.server.option.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataOptionRepository extends JpaRepository<OptionEntity, UUID> {}
