package com.finpulse.server.instrument.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class InstrumentRequest {
  @NotBlank String symbol;
  String name;
  String assetClass;
  String currency;
  String exchange;
}
