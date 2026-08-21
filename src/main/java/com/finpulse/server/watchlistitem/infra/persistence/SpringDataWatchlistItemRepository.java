package com.finpulse.server.watchlistitem.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataWatchlistItemRepository
    extends JpaRepository<WatchlistItemEntity, UUID> {}
