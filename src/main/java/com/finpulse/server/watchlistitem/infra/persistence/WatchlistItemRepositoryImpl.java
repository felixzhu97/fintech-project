package com.finpulse.server.watchlistitem.infra.persistence;

import com.finpulse.server.watchlistitem.domain.model.WatchlistItem;
import com.finpulse.server.watchlistitem.domain.repository.WatchlistItemRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WatchlistItemRepositoryImpl implements WatchlistItemRepository {
  private final SpringDataWatchlistItemRepository springData;

  @Override
  public List<WatchlistItem> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("addedAt").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<WatchlistItem> findById(UUID watchlistItemId) {
    return springData.findById(watchlistItemId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID watchlistItemId) {
    return springData.existsById(watchlistItemId);
  }

  @Override
  public WatchlistItem save(WatchlistItem item) {
    return toDomain(springData.save(toEntity(item)));
  }

  @Override
  public void deleteById(UUID watchlistItemId) {
    springData.deleteById(watchlistItemId);
  }

  private WatchlistItem toDomain(WatchlistItemEntity e) {
    return WatchlistItem.rehydrate(
        e.getWatchlistItemId(), e.getWatchlistId(), e.getInstrumentId(), e.getAddedAt());
  }

  private WatchlistItemEntity toEntity(WatchlistItem item) {
    return WatchlistItemEntity.builder()
        .watchlistItemId(item.watchlistItemId())
        .watchlistId(item.watchlistId())
        .instrumentId(item.instrumentId())
        .addedAt(item.addedAt())
        .build();
  }
}
