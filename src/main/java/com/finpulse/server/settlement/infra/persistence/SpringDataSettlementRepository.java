package com.finpulse.server.settlement.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataSettlementRepository extends JpaRepository<SettlementEntity, UUID> {}
