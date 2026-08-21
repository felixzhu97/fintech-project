package com.finpulse.server.instrument.infra.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInstrumentRepository extends JpaRepository<InstrumentEntity, UUID> {}
