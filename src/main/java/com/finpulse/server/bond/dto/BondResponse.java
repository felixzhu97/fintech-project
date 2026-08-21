package com.finpulse.server.bond.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class BondResponse {
  UUID bondId;
  UUID instrumentId;
  BigDecimal faceValue;
  BigDecimal couponRate;
  BigDecimal ytm;
  BigDecimal duration;
  BigDecimal convexity;
  BigDecimal maturityYears;
  Integer frequency;
}
