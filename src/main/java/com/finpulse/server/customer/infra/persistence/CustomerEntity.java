package com.finpulse.server.customer.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CustomerEntity {
  @Id
  @Column(name = "customer_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID customerId;

  @Column(nullable = false)
  private String name;

  private String email;

  @Column(name = "kyc_status")
  private String kycStatus;

  @Column(name = "created_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (customerId == null) {
      customerId = UUID.randomUUID();
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
