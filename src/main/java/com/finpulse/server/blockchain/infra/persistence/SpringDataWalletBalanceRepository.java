package com.finpulse.server.blockchain.infra.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataWalletBalanceRepository
    extends JpaRepository<WalletBalanceEntity, WalletBalanceEntity.Pk> {
  Optional<WalletBalanceEntity> findByAccountIdAndCurrency(UUID accountId, String currency);
}
