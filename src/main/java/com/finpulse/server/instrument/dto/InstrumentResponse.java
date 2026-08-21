package com.finpulse.server.instrument.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class InstrumentResponse {
  UUID instrumentId;
  String symbol;
  String name;
  String assetClass;
  String currency;
  String exchange;
}
