package com.finpulse.server.account.domain.repository;

import com.finpulse.server.account.domain.model.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository {
  List<Account> findAll(int limit, int offset);

  Optional<Account> findById(UUID accountId);

  boolean existsById(UUID accountId);

  Account save(Account account);

  void deleteById(UUID accountId);
}
