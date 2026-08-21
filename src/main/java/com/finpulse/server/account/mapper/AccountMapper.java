package com.finpulse.server.account.mapper;

import com.finpulse.server.account.domain.model.Account;
import com.finpulse.server.account.dto.AccountRequest;
import com.finpulse.server.account.dto.AccountResponse;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
  public Account toDomain(AccountRequest request) {
    return Account.create(
        request.getCustomerId(),
        request.getAccountType(),
        request.getCurrency(),
        request.getStatus());
  }

  public void apply(AccountRequest request, Account account) {
    String status =
        request.getStatus() == null || request.getStatus().isBlank()
            ? account.status()
            : request.getStatus();
    account.update(
        request.getCustomerId(), request.getAccountType(), request.getCurrency(), status);
  }

  public AccountResponse toResponse(Account account) {
    return AccountResponse.builder()
        .accountId(account.accountId())
        .customerId(account.customerId())
        .accountType(account.accountType())
        .currency(account.currency())
        .status(account.status())
        .openedAt(account.openedAt())
        .build();
  }
}
