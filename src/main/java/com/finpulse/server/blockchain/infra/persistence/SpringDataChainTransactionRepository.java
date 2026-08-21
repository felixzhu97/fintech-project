package com.finpulse.server.blockchain.infra.persistence;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataChainTransactionRepository
    extends JpaRepository<ChainTransactionEntity, UUID> {
  List<ChainTransactionEntity> findByBlockIndex(Integer blockIndex);
}
