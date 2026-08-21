package com.finpulse.server.watchlist.service;

import com.finpulse.server.watchlist.domain.model.Watchlist;
import com.finpulse.server.watchlist.domain.repository.WatchlistRepository;
import com.finpulse.server.watchlist.dto.WatchlistRequest;
import com.finpulse.server.watchlist.mapper.WatchlistMapper;
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
public class WatchlistService {
  private final WatchlistRepository repository;
  private final WatchlistMapper mapper;

  @Transactional(readOnly = true)
  public List<Watchlist> list(int limit, int offset) {
    return repository.findAll(limit, offset);
  }

  @Transactional(readOnly = true)
  public Watchlist getById(UUID id) {
    return repository
        .findById(id)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Watchlist not found"));
  }

  public Watchlist create(WatchlistRequest request) {
    return repository.save(mapper.toDomain(request));
  }

  public List<Watchlist> createBatch(List<WatchlistRequest> requests) {
    return requests.stream().map(this::create).toList();
  }

  public Watchlist update(UUID id, WatchlistRequest request) {
    Watchlist existing = getById(id);
    mapper.apply(request, existing);
    return repository.save(existing);
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Watchlist not found");
    }
    repository.deleteById(id);
  }
}
