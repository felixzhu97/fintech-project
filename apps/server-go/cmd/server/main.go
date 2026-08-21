package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	_ "finpulse/server-go/docs"
	"finpulse/server-go/internal/application"
	"finpulse/server-go/internal/config"
	"finpulse/server-go/internal/handler"
	"finpulse/server-go/internal/infrastructure/cache"
	"finpulse/server-go/internal/infrastructure/crypto"
	"finpulse/server-go/internal/infrastructure/persistence"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatal(err)
	}
	quoteRepo := persistence.NewQuoteRepo(pool)
	instrumentRepo := persistence.NewInstrumentRepo(pool)
	bondRepo := persistence.NewBondRepo(pool)
	optionRepo := persistence.NewOptionRepo(pool)
	authRepo := persistence.NewAuthRepo(pool)
	customerRepo := persistence.NewCustomerRepo(pool)
	passwordHasher := crypto.NewBcryptPasswordHasher()
	authSvc := application.NewAuthService(authRepo, customerRepo, passwordHasher)
	txMgr := persistence.NewPgxTxManager(pool)
	blockchainLedger := persistence.NewBlockchainLedgerRepo(pool)
	walletRepo := persistence.NewWalletBalanceRepo(pool)
	blockchainSvc := application.NewBlockchainService(txMgr, blockchainLedger, walletRepo)
	var cacheInstance application.Cache
	if cfg.RedisURL != "" {
		if opts, err := redis.ParseURL(cfg.RedisURL); err == nil {
			redisClient := redis.NewClient(opts)
			if err := redisClient.Ping(context.Background()).Err(); err == nil {
				cacheInstance = cache.NewRedisCache(redisClient)
			}
		}
	}
	accountRepo := persistence.NewAccountRepo(pool)
	watchlistRepo := persistence.NewWatchlistRepo(pool)
	watchlistItemRepo := persistence.NewWatchlistItemRepo(pool)
	portfolioRepo := persistence.NewPortfolioRepo(pool)
	positionRepo := persistence.NewPositionRepo(pool)
	orderRepo := persistence.NewOrderRepo(pool)
	tradeRepo := persistence.NewTradeRepo(pool)
	cashTransactionRepo := persistence.NewCashTransactionRepo(pool)
	paymentRepo := persistence.NewPaymentRepo(pool)
	settlementRepo := persistence.NewSettlementRepo(pool)
	marketDataRepo := persistence.NewMarketDataRepo(pool)
	customerSvc := application.NewCustomerService(customerRepo)
	accountSvc := application.NewAccountService(accountRepo)
	bondSvc := application.NewBondService(bondRepo)
	optionSvc := application.NewOptionService(optionRepo)
	watchlistSvc := application.NewWatchlistService(watchlistRepo)
	watchlistItemSvc := application.NewWatchlistItemService(watchlistItemRepo)
	portfolioSvc := application.NewPortfolioService(portfolioRepo)
	positionSvc := application.NewPositionService(positionRepo)
	orderSvc := application.NewOrderService(orderRepo)
	tradeSvc := application.NewTradeService(tradeRepo)
	cashTransactionSvc := application.NewCashTransactionService(cashTransactionRepo)
	paymentSvc := application.NewPaymentService(paymentRepo)
	settlementSvc := application.NewSettlementService(settlementRepo)
	marketDataSvc := application.NewMarketDataService(marketDataRepo)
	h := &handler.Handler{
		QuotesSvc:            application.NewQuotesService(quoteRepo),
		InstrumentsSvc:       application.NewInstrumentsService(instrumentRepo),
		AuthSvc:              authSvc,
		BlockchainSvc:        blockchainSvc,
		CustomerSvc:          customerSvc,
		AccountSvc:           accountSvc,
		BondSvc:              bondSvc,
		OptionSvc:            optionSvc,
		WatchlistSvc:         watchlistSvc,
		WatchlistItemSvc:     watchlistItemSvc,
		PortfolioSvc:         portfolioSvc,
		PositionSvc:          positionSvc,
		OrderSvc:             orderSvc,
		TradeSvc:             tradeSvc,
		CashTransactionSvc:   cashTransactionSvc,
		PaymentSvc:           paymentSvc,
		SettlementSvc:        settlementSvc,
		MarketDataSvc:        marketDataSvc,
		Cache:                cacheInstance,
	}
	r := gin.New()
	r.Use(gin.Recovery(), cors())
	r.GET("/health", h.Health)
	// Migrated slices proxied to Java (repo-root src/).
	javaProxy := handler.ProxyToJava(cfg.JavaBackendURL)
	r.Any("/api/v1/user-preferences", javaProxy)
	r.Any("/api/v1/user-preferences/*path", javaProxy)
	r.Any("/api/v1/auth", javaProxy)
	r.Any("/api/v1/auth/*path", javaProxy)
	r.Any("/api/v1/customers", javaProxy)
	r.Any("/api/v1/customers/*path", javaProxy)
	r.Any("/api/v1/accounts", javaProxy)
	r.Any("/api/v1/accounts/*path", javaProxy)
	r.Any("/api/v1/instruments", javaProxy)
	r.Any("/api/v1/instruments/*path", javaProxy)
	r.Any("/api/v1/bonds", javaProxy)
	r.Any("/api/v1/bonds/*path", javaProxy)
	r.Any("/api/v1/options", javaProxy)
	r.Any("/api/v1/options/*path", javaProxy)
	r.Any("/api/v1/market-data", javaProxy)
	r.Any("/api/v1/market-data/*path", javaProxy)
	r.Any("/api/v1/watchlists", javaProxy)
	r.Any("/api/v1/watchlists/*path", javaProxy)
	r.Any("/api/v1/watchlist-items", javaProxy)
	r.Any("/api/v1/watchlist-items/*path", javaProxy)
	r.Any("/api/v1/portfolios", javaProxy)
	r.Any("/api/v1/portfolios/*path", javaProxy)
	r.Any("/api/v1/positions", javaProxy)
	r.Any("/api/v1/positions/*path", javaProxy)
	r.Any("/api/v1/orders", javaProxy)
	r.Any("/api/v1/orders/*path", javaProxy)
	r.Any("/api/v1/trades", javaProxy)
	r.Any("/api/v1/trades/*path", javaProxy)
	r.Any("/api/v1/cash-transactions", javaProxy)
	r.Any("/api/v1/cash-transactions/*path", javaProxy)
	r.Any("/api/v1/payments", javaProxy)
	r.Any("/api/v1/payments/*path", javaProxy)
	r.Any("/api/v1/settlements", javaProxy)
	r.Any("/api/v1/settlements/*path", javaProxy)
	r.Any("/api/v1/quotes", javaProxy)
	r.Any("/api/v1/quotes/*path", javaProxy)
	r.Any("/api/v1/blockchain", javaProxy)
	r.Any("/api/v1/blockchain/*path", javaProxy)
	r.GET("/api/v1/watchlists/:watchlist_id", h.WatchlistsGet)
	r.POST("/api/v1/watchlists/batch", h.WatchlistsCreateBatch)
	r.DELETE("/api/v1/watchlists/:watchlist_id", h.WatchlistsDelete)
	r.GET("/api/v1/watchlist-items/:watchlist_item_id", h.WatchlistItemsGet)
	r.POST("/api/v1/watchlist-items/batch", h.WatchlistItemsCreateBatch)
	r.DELETE("/api/v1/watchlist-items/:watchlist_item_id", h.WatchlistItemsDelete)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.NoRoute(handler.ProxyAnalyticsOnly(cfg.PythonAnalyticsURL, cfg.PythonBackendURL))
	srv := &http.Server{Addr: ":" + cfg.Port, Handler: r}
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()
	log.Printf("server-go listening on :%s", cfg.Port)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	if err := srv.Shutdown(context.Background()); err != nil {
		log.Print(err)
	}
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "*")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
