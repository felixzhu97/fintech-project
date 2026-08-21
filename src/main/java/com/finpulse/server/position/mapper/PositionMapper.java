package com.finpulse.server.position.mapper;

import com.finpulse.server.position.domain.model.Position;
import com.finpulse.server.position.dto.PositionRequest;
import com.finpulse.server.position.dto.PositionResponse;
import org.springframework.stereotype.Component;

@Component
public class PositionMapper {
  public Position toDomain(PositionRequest request) { return Position.create(request.getPortfolioId(), request.getInstrumentId(), request.getQuantity(), request.getCostBasis()); }
  public void apply(PositionRequest request, Position entity) { entity.update(request.getPortfolioId(), request.getInstrumentId(), request.getQuantity(), request.getCostBasis()); }
  public PositionResponse toResponse(Position entity) {
    return PositionResponse.builder()
        .positionId(entity.positionId())
        .portfolioId(entity.portfolioId())
        .instrumentId(entity.instrumentId())
        .quantity(entity.quantity())
        .costBasis(entity.costBasis())
        .asOfDate(entity.asOfDate())
        .build();
  }
}
