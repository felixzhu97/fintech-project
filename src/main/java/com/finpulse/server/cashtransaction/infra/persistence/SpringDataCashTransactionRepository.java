package com.finpulse.server.cashtransaction.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataCashTransactionRepository extends JpaRepository<CashTransactionEntity, UUID> {}
