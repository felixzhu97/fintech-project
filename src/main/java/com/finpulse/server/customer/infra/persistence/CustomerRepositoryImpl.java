package com.finpulse.server.customer.infra.persistence;

import com.finpulse.server.customer.domain.model.Customer;
import com.finpulse.server.customer.domain.repository.CustomerRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomerRepositoryImpl implements CustomerRepository {
  private final SpringDataCustomerRepository springData;

  @Override
  public Optional<Customer> findById(UUID customerId) {
    return springData.findById(customerId).map(this::toDomain);
  }

  @Override
  public Customer save(Customer customer) {
    return toDomain(springData.save(toEntity(customer)));
  }

  private Customer toDomain(CustomerEntity e) {
    return Customer.rehydrate(
        e.getCustomerId(), e.getName(), e.getEmail(), e.getKycStatus(), e.getCreatedAt());
  }

  private CustomerEntity toEntity(Customer c) {
    return CustomerEntity.builder()
        .customerId(c.customerId())
        .name(c.name())
        .email(c.email())
        .kycStatus(c.kycStatus())
        .createdAt(c.createdAt())
        .build();
  }
}
