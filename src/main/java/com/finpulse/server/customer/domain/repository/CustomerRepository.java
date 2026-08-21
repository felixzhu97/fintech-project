package com.finpulse.server.customer.domain.repository;

import com.finpulse.server.customer.domain.model.Customer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {
  List<Customer> findAll(int limit, int offset);

  Optional<Customer> findById(UUID customerId);

  boolean existsById(UUID customerId);

  Customer save(Customer customer);

  void deleteById(UUID customerId);
}
