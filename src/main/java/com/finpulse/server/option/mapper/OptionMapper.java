package com.finpulse.server.option.mapper;

import com.finpulse.server.option.domain.model.Option;
import com.finpulse.server.option.dto.OptionRequest;
import com.finpulse.server.option.dto.OptionResponse;
import org.springframework.stereotype.Component;

@Component
public class OptionMapper {
  public Option toDomain(OptionRequest request) {
    return Option.create(
        request.getInstrumentId(),
        request.getUnderlyingInstrumentId(),
        request.getStrike(),
        request.getExpiry(),
        request.getOptionType(),
        request.getRiskFreeRate(),
        request.getVolatility(),
        request.getBsPrice(),
        request.getDelta(),
        request.getGamma(),
        request.getTheta(),
        request.getVega(),
        request.getRho(),
        request.getImpliedVolatility());
  }

  public void apply(OptionRequest request, Option option) {
    option.update(
        request.getInstrumentId(),
        request.getUnderlyingInstrumentId(),
        request.getStrike(),
        request.getExpiry(),
        request.getOptionType(),
        request.getRiskFreeRate(),
        request.getVolatility(),
        request.getBsPrice(),
        request.getDelta(),
        request.getGamma(),
        request.getTheta(),
        request.getVega(),
        request.getRho(),
        request.getImpliedVolatility());
  }

  public OptionResponse toResponse(Option option) {
    return OptionResponse.builder()
        .optionId(option.optionId())
        .instrumentId(option.instrumentId())
        .underlyingInstrumentId(option.underlyingInstrumentId())
        .strike(option.strike())
        .expiry(option.expiry())
        .optionType(option.optionType())
        .riskFreeRate(option.riskFreeRate())
        .volatility(option.volatility())
        .bsPrice(option.bsPrice())
        .delta(option.delta())
        .gamma(option.gamma())
        .theta(option.theta())
        .vega(option.vega())
        .rho(option.rho())
        .impliedVolatility(option.impliedVolatility())
        .build();
  }
}
