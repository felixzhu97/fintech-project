/**
 * Seed API payload / row types — mirror Java *Request DTOs
 * (Jackson SNAKE_CASE). Used by generate-seed-data.ts.
 */

/** CustomerRequest */
export interface CustomerRequest {
  name: string;
  email?: string;
  kyc_status?: string;
}

/** UserPreferenceRequest */
export interface UserPreferenceRequest {
  customer_id: string;
  theme?: string;
  language?: string;
  notifications_enabled?: boolean;
}

/** AccountRequest */
export interface AccountRequest {
  customer_id: string;
  account_type: string;
  currency: string;
  status?: string;
}

/** InstrumentRequest */
export interface InstrumentRequest {
  symbol: string;
  name?: string;
  asset_class?: string;
  currency?: string;
  exchange?: string;
}

/** PortfolioRequest */
export interface PortfolioRequest {
  account_id: string;
  name: string;
  base_currency: string;
}

/** PositionRequest */
export interface PositionRequest {
  portfolio_id: string;
  instrument_id: string;
  quantity: number;
  cost_basis?: number;
}

/** WatchlistRequest */
export interface WatchlistRequest {
  customer_id: string;
  name: string;
}

/** WatchlistItemRequest */
export interface WatchlistItemRequest {
  watchlist_id: string;
  instrument_id: string;
}

/** BondRequest */
export interface BondRequest {
  instrument_id: string;
  face_value?: number;
  coupon_rate?: number;
  ytm?: number;
  duration?: number;
  convexity?: number;
  maturity_years?: number;
  frequency?: number;
}

/** OptionRequest */
export interface OptionRequest {
  instrument_id: string;
  underlying_instrument_id: string;
  strike: number;
  expiry: string;
  option_type: string;
  risk_free_rate?: number;
  volatility?: number;
  bs_price?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
  implied_volatility?: number;
}

/** TradeOrderRequest */
export interface TradeOrderRequest {
  account_id: string;
  instrument_id: string;
  side: string;
  quantity: number;
  order_type: string;
  status: string;
}

/** TradeRequest */
export interface TradeRequest {
  order_id: string;
  quantity: number;
  price: number;
  fee?: number;
}

/** CashTransactionRequest */
export interface CashTransactionRequest {
  account_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
}

/** PaymentRequest */
export interface PaymentRequest {
  account_id: string;
  counterparty?: string;
  amount: number;
  currency: string;
  status: string;
}

/** SettlementRequest */
export interface SettlementRequest {
  trade_id: string;
  payment_id: string;
  status: string;
  settled_at?: string;
}

/** MarketDataRequest */
export interface MarketDataRequest {
  instrument_id: string;
  timestamp: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: number;
  change_pct?: number;
}

/** RegisterRequest */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface BlockchainSeedBalanceRequest {
  account_id: string;
  currency?: string;
  amount: number;
}

export interface BlockchainTransferRequest {
  sender_account_id: string;
  receiver_account_id: string;
  amount: number;
  currency?: string;
}

export interface CustomerRow {
  customer_id: string;
}

export interface AccountRow {
  account_id: string;
}

export interface InstrumentRow {
  instrument_id: string;
}

export interface PortfolioRow {
  portfolio_id: string;
}

export interface WatchlistRow {
  watchlist_id: string;
}

export interface OrderRow {
  order_id: string;
}

export interface TradeRow {
  trade_id: string;
}

export interface PaymentRow {
  payment_id: string;
}

/** Proxied analytics payloads (no Java DTO). */
export interface RiskMetricRequest {
  portfolio_id: string;
  risk_level: string;
  volatility: number;
  sharpe_ratio: number;
  var: number;
  beta: number;
}

export interface ValuationRequest {
  instrument_id: string;
  method: string;
  ev?: number;
  equity_value?: number;
  target_price?: number;
  discount_rate?: number;
  growth_rate?: number;
  multiples?: number;
}

export type MarketQuote = Pick<
  MarketDataRequest,
  "open" | "high" | "low" | "close" | "volume" | "change_pct"
>;
