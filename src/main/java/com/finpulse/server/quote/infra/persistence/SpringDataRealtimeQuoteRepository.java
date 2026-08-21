package com.finpulse.server.quote.infra.persistence;

import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataRealtimeQuoteRepository extends JpaRepository<RealtimeQuoteEntity, String> {
  List<RealtimeQuoteEntity> findBySymbolIn(Collection<String> symbols);
}
