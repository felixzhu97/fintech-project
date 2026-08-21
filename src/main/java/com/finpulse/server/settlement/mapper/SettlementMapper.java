package com.finpulse.server.settlement.mapper;

import com.finpulse.server.settlement.domain.model.Settlement;
import com.finpulse.server.settlement.dto.SettlementRequest;
import com.finpulse.server.settlement.dto.SettlementResponse;
import org.springframework.stereotype.Component;

@Component
public class SettlementMapper {
  public Settlement toDomain(SettlementRequest request) { return Settlement.create(request.getTradeId(), request.getPaymentId(), request.getStatus(), request.getSettledAt()); }
  public void apply(SettlementRequest request, Settlement entity) { entity.update(request.getTradeId(), request.getPaymentId(), request.getStatus(), request.getSettledAt()); }
  public SettlementResponse toResponse(Settlement entity) {
    return SettlementResponse.builder()
        .settlementId(entity.settlementId())
        .tradeId(entity.tradeId())
        .paymentId(entity.paymentId())
        .status(entity.status())
        .settledAt(entity.settledAt())
        .build();
  }
}
