package com.finpulse.server.customer.infra.persistence;

import com.finpulse.server.customer.domain.model.Customer;
import com.finpulse.server.customer.domain.repository.CustomerRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomerRepositoryImpl implements CustomerRepository {
  private final SpringDataCustomerRepository springData;

  @Override
  public List<Customer> findAll(int limit, int offset) {
    int size = limit <= 0 ? 100 : limit;
    int start = Math.max(offset, 0);
    return springData.findAll(Sort.by("createdAt").descending()).stream()
        .skip(start)
        .limit(size)
        .map(this::toDomain)
        .toList();
  }

  @Override
  public Optional<Customer> findById(UUID customerId) {
    return springData.findById(customerId).map(this::toDomain);
  }

  @Override
  public boolean existsById(UUID customerId) {
    return springData.existsById(customerId);
  }

  @Override
  public Customer save(Customer customer) {
    return toDomain(springData.save(toEntity(customer)));
  }

  @Override
  public void deleteById(UUID customerId) {
    springData.deleteById(customerId);
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
