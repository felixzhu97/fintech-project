package com.finpulse.server.preference.mapper;

import com.finpulse.server.preference.domain.model.UserPreference;
import com.finpulse.server.preference.dto.UserPreferenceRequest;
import com.finpulse.server.preference.dto.UserPreferenceResponse;
import org.springframework.stereotype.Component;

@Component
public class UserPreferenceMapper {

  public UserPreference toDomain(UserPreferenceRequest request) {
    return UserPreference.create(
        request.getCustomerId(),
        request.getTheme(),
        request.getLanguage(),
        request.isNotificationsEnabled());
  }

  public void apply(UserPreferenceRequest request, UserPreference preference) {
    preference.update(
        request.getCustomerId(),
        request.getTheme(),
        request.getLanguage(),
        request.isNotificationsEnabled());
  }

  public UserPreferenceResponse toResponse(UserPreference preference) {
    return UserPreferenceResponse.builder()
        .preferenceId(preference.preferenceId())
        .customerId(preference.customerId())
        .theme(preference.theme())
        .language(preference.language())
        .notificationsEnabled(preference.notificationsEnabled())
        .updatedAt(preference.updatedAt())
        .build();
  }
}
