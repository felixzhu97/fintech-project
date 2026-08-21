package com.finpulse.server.cashtransaction.mapper;

import com.finpulse.server.cashtransaction.domain.model.CashTransaction;
import com.finpulse.server.cashtransaction.dto.CashTransactionRequest;
import com.finpulse.server.cashtransaction.dto.CashTransactionResponse;
import org.springframework.stereotype.Component;

@Component
public class CashTransactionMapper {
  public CashTransaction toDomain(CashTransactionRequest request) { return CashTransaction.create(request.getAccountId(), request.getType(), request.getAmount(), request.getCurrency(), request.getStatus()); }
  public void apply(CashTransactionRequest request, CashTransaction entity) { entity.update(request.getAccountId(), request.getType(), request.getAmount(), request.getCurrency(), request.getStatus()); }
  public CashTransactionResponse toResponse(CashTransaction entity) {
    return CashTransactionResponse.builder()
        .transactionId(entity.transactionId())
        .accountId(entity.accountId())
        .type(entity.type())
        .amount(entity.amount())
        .currency(entity.currency())
        .status(entity.status())
        .createdAt(entity.createdAt())
        .build();
  }
}
