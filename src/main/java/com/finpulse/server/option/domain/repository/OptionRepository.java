package com.finpulse.server.option.domain.repository;

import com.finpulse.server.option.domain.model.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OptionRepository {
  List<Option> findAll(int limit, int offset);

  Optional<Option> findById(UUID optionId);

  boolean existsById(UUID optionId);

  Option save(Option option);

  void deleteById(UUID optionId);
}
