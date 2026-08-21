package com.finpulse.server.instrument.infra.persistence;

import com.finpulse.server.instrument.domain.model.Instrument;
import com.finpulse.server.instrument.domain.repository.InstrumentRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class InstrumentRepositoryImpl implements InstrumentRepository {
  private final SpringDataInstrumentRepository springData;

  @Override
  public List<Instrument> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("instrumentId").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Instrument> findById(UUID id) {
    return springData.findById(id).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID id) {
    return springData.existsById(id);
  }

  @Override
  public Instrument save(Instrument entity) {
    return toDomain(springData.save(toEntity(entity)));
  }

  @Override
  public void deleteById(UUID id) {
    springData.deleteById(id);
  }

  private Instrument toDomain(InstrumentEntity e) {
    return Instrument.rehydrate(e.getInstrumentId(), e.getSymbol(), e.getName(), e.getAssetClass(), e.getCurrency(), e.getExchange());
  }

  private InstrumentEntity toEntity(Instrument d) {
    return InstrumentEntity.builder()
        .instrumentId(d.instrumentId())
        .symbol(d.symbol())
        .name(d.name())
        .assetClass(d.assetClass())
        .currency(d.currency())
        .exchange(d.exchange())
        .build();
  }
}
