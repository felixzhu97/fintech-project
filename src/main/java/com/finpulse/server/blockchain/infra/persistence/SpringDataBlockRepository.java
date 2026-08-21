package com.finpulse.server.blockchain.infra.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataBlockRepository extends JpaRepository<BlockEntity, Integer> {
  Optional<BlockEntity> findTopByOrderByBlockIndexDesc();

  List<BlockEntity> findAllByOrderByBlockIndexAsc();
}
