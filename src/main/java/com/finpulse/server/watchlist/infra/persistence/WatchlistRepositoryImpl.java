package com.finpulse.server.watchlist.infra.persistence;

import com.finpulse.server.watchlist.domain.model.Watchlist;
import com.finpulse.server.watchlist.domain.repository.WatchlistRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WatchlistRepositoryImpl implements WatchlistRepository {
  private final SpringDataWatchlistRepository springData;

  @Override
  public List<Watchlist> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Watchlist> findById(UUID watchlistId) {
    return springData.findById(watchlistId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID watchlistId) {
    return springData.existsById(watchlistId);
  }

  @Override
  public Watchlist save(Watchlist watchlist) {
    return toDomain(springData.save(toEntity(watchlist)));
  }

  @Override
  public void deleteById(UUID watchlistId) {
    springData.deleteById(watchlistId);
  }

  private Watchlist toDomain(WatchlistEntity e) {
    return Watchlist.rehydrate(
        e.getWatchlistId(), e.getCustomerId(), e.getName(), e.getCreatedAt());
  }

  private WatchlistEntity toEntity(Watchlist w) {
    return WatchlistEntity.builder()
        .watchlistId(w.watchlistId())
        .customerId(w.customerId())
        .name(w.name())
        .createdAt(w.createdAt())
        .build();
  }
}
