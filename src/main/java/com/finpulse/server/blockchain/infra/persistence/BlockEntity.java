package com.finpulse.server.blockchain.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "block")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BlockEntity {
  @Id
  @Column(name = "block_index", nullable = false)
  private Integer blockIndex;

  @Column(nullable = false)
  private Instant timestamp;

  @Column(name = "previous_hash", nullable = false)
  private String previousHash;

  @Column(nullable = false)
  private String hash;
}
