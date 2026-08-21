package com.finpulse.server.watchlist.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataWatchlistRepository extends JpaRepository<WatchlistEntity, UUID> {}
