package com.finpulse.server.quote.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.math.BigDecimal;
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
public class RealtimeQuoteEntity {
  @Id
  @Column(nullable = false)
  private String symbol;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(name = "change", nullable = false)
  private BigDecimal change;

  @Column(name = "change_rate", nullable = false)
  private BigDecimal changeRate;
}
