package com.finpulse.server.blockchain.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@IdClass(WalletBalanceEntity.Pk.class)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WalletBalanceEntity {
  @Id
  @Column(name = "account_id", nullable = false)
  private UUID accountId;

  @Id
  @Column(nullable = false)
  private String currency;

  @Column(nullable = false)
  private BigDecimal balance;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @EqualsAndHashCode
  public static class Pk implements Serializable {
    private UUID accountId;
    private String currency;
  }
}
