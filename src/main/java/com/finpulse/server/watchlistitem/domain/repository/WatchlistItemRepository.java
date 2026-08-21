package com.finpulse.server.watchlistitem.domain.repository;

import com.finpulse.server.watchlistitem.domain.model.WatchlistItem;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WatchlistItemRepository {
  List<WatchlistItem> findAll(int limit, int offset);

  Optional<WatchlistItem> findById(UUID watchlistItemId);

  boolean existsById(UUID watchlistItemId);

  WatchlistItem save(WatchlistItem watchlistItem);

  void deleteById(UUID watchlistItemId);
}
