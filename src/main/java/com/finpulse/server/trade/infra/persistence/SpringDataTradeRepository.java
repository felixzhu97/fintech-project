package com.finpulse.server.trade.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataTradeRepository extends JpaRepository<TradeEntity, UUID> {}
