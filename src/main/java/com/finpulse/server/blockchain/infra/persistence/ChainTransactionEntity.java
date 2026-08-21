package com.finpulse.server.blockchain.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChainTransactionEntity {
  @Id
  @Column(name = "tx_id", nullable = false)
  private UUID txId;

  @Column(name = "block_index", nullable = false)
  private Integer blockIndex;

  @Column(name = "sender_account_id", nullable = false)
  private UUID senderAccountId;

  @Column(name = "receiver_account_id", nullable = false)
  private UUID receiverAccountId;

  @Column(nullable = false)
  private BigDecimal amount;

  @Column(nullable = false)
  private String currency;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
