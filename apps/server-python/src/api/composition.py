import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

from src.infrastructure.cache import create_redis_client
from src.infrastructure.cache.quote_cache import QuoteCache
from src.infrastructure.database.repositories.realtime_quote_repository import (
    RealtimeQuoteRepository,
)
from src.infrastructure.database.session import create_engine_and_session_factory
from src.infrastructure.market_data.kafka_quote_consumer import KafkaQuoteConsumer
from src.infrastructure.market_data.kafka_quote_producer import KafkaQuoteProducer
from src.infrastructure.market_data.mock_quote_writer import MockQuoteWriter

logger = logging.getLogger(__name__)


def _run_migrations() -> None:
    import os

    if os.environ.get("SKIP_ALEMBIC_ON_STARTUP", "").lower() in ("1", "true", "yes"):
        logger.info("Migrations skipped via SKIP_ALEMBIC_ON_STARTUP")
        return
    try:
        from alembic import command
        from alembic.config import Config
        config = Config("alembic.ini")
        command.upgrade(config, "head")
        logger.info("Migrations complete")
    except Exception as e:
        logger.warning("Migration skipped: %s", e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Lifespan: migrations")
    _run_migrations()
    logger.info("Lifespan: database")
    engine, session_factory = create_engine_and_session_factory()
    app.state.engine = engine
    app.state.session_factory = session_factory

    logger.info("Lifespan: redis")
    redis_client = create_redis_client()
    app.state.redis = redis_client

    quote_cache = QuoteCache()
    quote_repo = RealtimeQuoteRepository(cache=quote_cache)
    app.state.realtime_quote_repo = quote_repo

    def on_kafka_batch(batch: dict) -> None:
        quote_repo.upsert_quotes(batch)
        try:
            quote_repo.insert_ticks(batch)
        except Exception as e:
            logger.warning("insert_ticks failed: %s", e)

    logger.info("Lifespan: kafka consumer")
    kafka_consumer = KafkaQuoteConsumer(on_batch=on_kafka_batch)
    try:
        kafka_consumer.start()
    except Exception as e:
        logger.warning("Kafka quote consumer start failed: %s", e)

    logger.info("Lifespan: mock quote writer")
    kafka_producer = KafkaQuoteProducer()
    mock_writer = MockQuoteWriter(repository=quote_repo, producer=kafka_producer)
    try:
        mock_writer.start()
    except Exception as e:
        logger.warning("Mock quote writer start failed: %s", e)
    app.state.mock_quote_writer = mock_writer
    app.state.kafka_quote_consumer = kafka_consumer

    logger.info("Application lifespan ready")
    yield

    mock_writer.stop()
    kafka_consumer.stop()
    if redis_client:
        await redis_client.aclose()
    await engine.dispose()
