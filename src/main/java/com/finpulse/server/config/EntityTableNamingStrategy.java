package com.finpulse.server.config;

import org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

/**
 * Maps {@code FooEntity} → table {@code foo} without {@code @Table}.
 * {@code TradeOrderEntity} maps to {@code orders} to match Liquibase.
 */
public class EntityTableNamingStrategy extends CamelCaseToUnderscoresNamingStrategy {

  @Override
  public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment jdbcEnvironment) {
    String text = name.getText();
    if (text.endsWith("Entity")) {
      text = text.substring(0, text.length() - "Entity".length());
    }
    if ("TradeOrder".equals(text)) {
      text = "Orders";
    }
    return super.toPhysicalTableName(Identifier.toIdentifier(text), jdbcEnvironment);
  }
}
