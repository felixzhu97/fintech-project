package com.finpulse.server.watchlist.domain.repository;

import com.finpulse.server.watchlist.domain.model.Watchlist;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WatchlistRepository {
  List<Watchlist> findAll(int limit, int offset);

  Optional<Watchlist> findById(UUID watchlistId);

  boolean existsById(UUID watchlistId);

  Watchlist save(Watchlist watchlist);

  void deleteById(UUID watchlistId);
}
