package com.finpulse.server.instrument.mapper;

import com.finpulse.server.instrument.domain.model.Instrument;
import com.finpulse.server.instrument.dto.InstrumentRequest;
import com.finpulse.server.instrument.dto.InstrumentResponse;
import org.springframework.stereotype.Component;

@Component
public class InstrumentMapper {
  public Instrument toDomain(InstrumentRequest request) {
    return Instrument.create(request.getSymbol(), request.getName(), request.getAssetClass(), request.getCurrency(), request.getExchange());
  }

  public void apply(InstrumentRequest request, Instrument entity) {
    entity.update(request.getSymbol(), request.getName(), request.getAssetClass(), request.getCurrency(), request.getExchange());
  }

  public InstrumentResponse toResponse(Instrument entity) {
    return InstrumentResponse.builder()
        .instrumentId(entity.instrumentId())
        .symbol(entity.symbol())
        .name(entity.name())
        .assetClass(entity.assetClass())
        .currency(entity.currency())
        .exchange(entity.exchange())
        .build();
  }
}
