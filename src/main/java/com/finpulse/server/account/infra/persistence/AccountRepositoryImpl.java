package com.finpulse.server.account.infra.persistence;

import com.finpulse.server.account.domain.model.Account;
import com.finpulse.server.account.domain.repository.AccountRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AccountRepositoryImpl implements AccountRepository {
  private final SpringDataAccountRepository springData;

  @Override
  public List<Account> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("openedAt").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Account> findById(UUID accountId) {
    return springData.findById(accountId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID accountId) {
    return springData.existsById(accountId);
  }

  @Override
  public Account save(Account account) {
    return toDomain(springData.save(toEntity(account)));
  }

  @Override
  public void deleteById(UUID accountId) {
    springData.deleteById(accountId);
  }

  private Account toDomain(AccountEntity e) {
    return Account.rehydrate(
        e.getAccountId(),
        e.getCustomerId(),
        e.getAccountType(),
        e.getCurrency(),
        e.getStatus(),
        e.getOpenedAt());
  }

  private AccountEntity toEntity(Account a) {
    return AccountEntity.builder()
        .accountId(a.accountId())
        .customerId(a.customerId())
        .accountType(a.accountType())
        .currency(a.currency())
        .status(a.status())
        .openedAt(a.openedAt())
        .build();
  }
}
