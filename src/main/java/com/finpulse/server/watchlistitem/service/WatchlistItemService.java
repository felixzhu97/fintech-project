package com.finpulse.server.watchlistitem.service;

import com.finpulse.server.watchlistitem.domain.model.WatchlistItem;
import com.finpulse.server.watchlistitem.domain.repository.WatchlistItemRepository;
import com.finpulse.server.watchlistitem.dto.WatchlistItemRequest;
import com.finpulse.server.watchlistitem.mapper.WatchlistItemMapper;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class WatchlistItemService {
  private final WatchlistItemRepository repository;
  private final WatchlistItemMapper mapper;

  @Transactional(readOnly = true)
  public List<WatchlistItem> list(int limit, int offset) {
    return repository.findAll(limit, offset);
  }

  @Transactional(readOnly = true)
  public WatchlistItem getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Watchlist item not found"));
  }

  public WatchlistItem create(WatchlistItemRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<WatchlistItem> createBatch(List<WatchlistItemRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public WatchlistItem update(UUID id, WatchlistItemRequest request) {
    WatchlistItem existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Watchlist item not found");
    }
    repository.deleteById(id);
  }
}
