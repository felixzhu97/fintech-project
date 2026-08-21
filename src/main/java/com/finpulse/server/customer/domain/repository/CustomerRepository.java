package com.finpulse.server.customer.domain.repository;

import com.finpulse.server.customer.domain.model.Customer;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {
  Optional<Customer> findById(UUID customerId);

  Customer save(Customer customer);
}
