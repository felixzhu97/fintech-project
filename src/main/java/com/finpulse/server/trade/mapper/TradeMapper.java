package com.finpulse.server.trade.mapper;

import com.finpulse.server.trade.domain.model.Trade;
import com.finpulse.server.trade.dto.TradeRequest;
import com.finpulse.server.trade.dto.TradeResponse;
import org.springframework.stereotype.Component;

@Component
public class TradeMapper {
  public Trade toDomain(TradeRequest request) { return Trade.create(request.getOrderId(), request.getQuantity(), request.getPrice(), request.getFee()); }
  public void apply(TradeRequest request, Trade entity) { entity.update(request.getOrderId(), request.getQuantity(), request.getPrice(), request.getFee()); }
  public TradeResponse toResponse(Trade entity) {
    return TradeResponse.builder()
        .tradeId(entity.tradeId())
        .orderId(entity.orderId())
        .quantity(entity.quantity())
        .price(entity.price())
        .fee(entity.fee())
        .executedAt(entity.executedAt())
        .build();
  }
}
