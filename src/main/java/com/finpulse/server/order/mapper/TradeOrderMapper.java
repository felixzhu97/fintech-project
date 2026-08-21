package com.finpulse.server.order.mapper;

import com.finpulse.server.order.domain.model.TradeOrder;
import com.finpulse.server.order.dto.TradeOrderRequest;
import com.finpulse.server.order.dto.TradeOrderResponse;
import org.springframework.stereotype.Component;

@Component
public class TradeOrderMapper {
  public TradeOrder toDomain(TradeOrderRequest request) { return TradeOrder.create(request.getAccountId(), request.getInstrumentId(), request.getSide(), request.getQuantity(), request.getOrderType(), request.getStatus()); }
  public void apply(TradeOrderRequest request, TradeOrder entity) { entity.update(request.getAccountId(), request.getInstrumentId(), request.getSide(), request.getQuantity(), request.getOrderType(), request.getStatus()); }
  public TradeOrderResponse toResponse(TradeOrder entity) {
    return TradeOrderResponse.builder()
        .orderId(entity.orderId())
        .accountId(entity.accountId())
        .instrumentId(entity.instrumentId())
        .side(entity.side())
        .quantity(entity.quantity())
        .orderType(entity.orderType())
        .status(entity.status())
        .createdAt(entity.createdAt())
        .build();
  }
}
