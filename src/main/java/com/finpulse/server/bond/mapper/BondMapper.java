package com.finpulse.server.bond.mapper;

import com.finpulse.server.bond.domain.model.Bond;
import com.finpulse.server.bond.dto.BondRequest;
import com.finpulse.server.bond.dto.BondResponse;
import org.springframework.stereotype.Component;

@Component
public class BondMapper {
  public Bond toDomain(BondRequest request) {
    return Bond.create(request.getInstrumentId(), request.getFaceValue(), request.getCouponRate(), request.getYtm(), request.getDuration(), request.getConvexity(), request.getMaturityYears(), request.getFrequency());
  }

  public void apply(BondRequest request, Bond entity) {
    entity.update(request.getInstrumentId(), request.getFaceValue(), request.getCouponRate(), request.getYtm(), request.getDuration(), request.getConvexity(), request.getMaturityYears(), request.getFrequency());
  }

  public BondResponse toResponse(Bond entity) {
    return BondResponse.builder()
        .bondId(entity.bondId())
        .instrumentId(entity.instrumentId())
        .faceValue(entity.faceValue())
        .couponRate(entity.couponRate())
        .ytm(entity.ytm())
        .duration(entity.duration())
        .convexity(entity.convexity())
        .maturityYears(entity.maturityYears())
        .frequency(entity.frequency())
        .build();
  }
}
