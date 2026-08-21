package com.finpulse.server.bond.infra.persistence;

import com.finpulse.server.bond.domain.model.Bond;
import com.finpulse.server.bond.domain.repository.BondRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BondRepositoryImpl implements BondRepository {
  private final SpringDataBondRepository springData;

  @Override
  public List<Bond> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("bondId").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Bond> findById(UUID id) {
    return springData.findById(id).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID id) {
    return springData.existsById(id);
  }

  @Override
  public Bond save(Bond entity) {
    return toDomain(springData.save(toEntity(entity)));
  }

  @Override
  public void deleteById(UUID id) {
    springData.deleteById(id);
  }

  private Bond toDomain(BondEntity e) {
    return Bond.rehydrate(e.getBondId(), e.getInstrumentId(), e.getFaceValue(), e.getCouponRate(), e.getYtm(), e.getDuration(), e.getConvexity(), e.getMaturityYears(), e.getFrequency());
  }

  private BondEntity toEntity(Bond d) {
    return BondEntity.builder()
        .bondId(d.bondId())
        .instrumentId(d.instrumentId())
        .faceValue(d.faceValue())
        .couponRate(d.couponRate())
        .ytm(d.ytm())
        .duration(d.duration())
        .convexity(d.convexity())
        .maturityYears(d.maturityYears())
        .frequency(d.frequency())
        .build();
  }
}
