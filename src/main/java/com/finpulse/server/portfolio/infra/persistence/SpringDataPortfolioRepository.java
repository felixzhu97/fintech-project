package com.finpulse.server.portfolio.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPortfolioRepository extends JpaRepository<PortfolioEntity, UUID> {}
