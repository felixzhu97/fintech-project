package com.finpulse.server.option.infra.persistence;

import com.finpulse.server.option.domain.model.Option;
import com.finpulse.server.option.domain.repository.OptionRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OptionRepositoryImpl implements OptionRepository {
  private final SpringDataOptionRepository springData;

  @Override
  public List<Option> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("optionId")).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Option> findById(UUID optionId) {
    return springData.findById(optionId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID optionId) {
    return springData.existsById(optionId);
  }

  @Override
  public Option save(Option option) {
    return toDomain(springData.save(toEntity(option)));
  }

  @Override
  public void deleteById(UUID optionId) {
    springData.deleteById(optionId);
  }

  private Option toDomain(OptionEntity e) {
    return Option.rehydrate(
        e.getOptionId(),
        e.getInstrumentId(),
        e.getUnderlyingInstrumentId(),
        e.getStrike(),
        e.getExpiry(),
        e.getOptionType(),
        e.getRiskFreeRate(),
        e.getVolatility(),
        e.getBsPrice(),
        e.getDelta(),
        e.getGamma(),
        e.getTheta(),
        e.getVega(),
        e.getRho(),
        e.getImpliedVolatility());
  }

  private OptionEntity toEntity(Option o) {
    return OptionEntity.builder()
        .optionId(o.optionId())
        .instrumentId(o.instrumentId())
        .underlyingInstrumentId(o.underlyingInstrumentId())
        .strike(o.strike())
        .expiry(o.expiry())
        .optionType(o.optionType())
        .riskFreeRate(o.riskFreeRate())
        .volatility(o.volatility())
        .bsPrice(o.bsPrice())
        .delta(o.delta())
        .gamma(o.gamma())
        .theta(o.theta())
        .vega(o.vega())
        .rho(o.rho())
        .impliedVolatility(o.impliedVolatility())
        .build();
  }
}
