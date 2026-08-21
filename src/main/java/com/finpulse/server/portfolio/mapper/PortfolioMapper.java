package com.finpulse.server.portfolio.mapper;

import com.finpulse.server.portfolio.domain.model.Portfolio;
import com.finpulse.server.portfolio.dto.PortfolioRequest;
import com.finpulse.server.portfolio.dto.PortfolioResponse;
import org.springframework.stereotype.Component;

@Component
public class PortfolioMapper {
  public Portfolio toDomain(PortfolioRequest request) { return Portfolio.create(request.getAccountId(), request.getName(), request.getBaseCurrency()); }
  public void apply(PortfolioRequest request, Portfolio entity) { entity.update(request.getAccountId(), request.getName(), request.getBaseCurrency()); }
  public PortfolioResponse toResponse(Portfolio entity) {
    return PortfolioResponse.builder()
        .portfolioId(entity.portfolioId())
        .accountId(entity.accountId())
        .name(entity.name())
        .baseCurrency(entity.baseCurrency())
        .createdAt(entity.createdAt())
        .build();
  }
}
