package com.finpulse.server.payment.mapper;

import com.finpulse.server.payment.domain.model.Payment;
import com.finpulse.server.payment.dto.PaymentRequest;
import com.finpulse.server.payment.dto.PaymentResponse;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {
  public Payment toDomain(PaymentRequest request) { return Payment.create(request.getAccountId(), request.getCounterparty(), request.getAmount(), request.getCurrency(), request.getStatus()); }
  public void apply(PaymentRequest request, Payment entity) { entity.update(request.getAccountId(), request.getCounterparty(), request.getAmount(), request.getCurrency(), request.getStatus()); }
  public PaymentResponse toResponse(Payment entity) {
    return PaymentResponse.builder()
        .paymentId(entity.paymentId())
        .accountId(entity.accountId())
        .counterparty(entity.counterparty())
        .amount(entity.amount())
        .currency(entity.currency())
        .status(entity.status())
        .createdAt(entity.createdAt())
        .build();
  }
}
