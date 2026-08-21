package com.finpulse.server.order.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataTradeOrderRepository extends JpaRepository<TradeOrderEntity, UUID> {}
