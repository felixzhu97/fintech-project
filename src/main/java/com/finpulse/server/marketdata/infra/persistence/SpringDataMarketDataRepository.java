package com.finpulse.server.marketdata.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataMarketDataRepository extends JpaRepository<MarketDataEntity, UUID> {}
