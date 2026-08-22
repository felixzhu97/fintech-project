# Glossary | 领域术语表

> FinPulse — Ubiquitous Language（统一语言）

---

## 1. Purpose | 文档说明

This document defines the project **Ubiquitous Language**. English terms are the **preferred canonical names** and must align with code, API, and architecture naming. Chinese labels are for localization and stakeholder communication only.

### Maintenance Principles

1. **Glossary first**: Add or update terms here before implementing code
2. **Code sync**: Domain model changes must update the corresponding glossary entry
3. **Preferred term**: Use the **Preferred Term (English)** column for code, API, Jira keys, commits, and technical docs

| Scenario | Rule |
| -------- | ---- |
| Java / Python / API / commits | Use Preferred Term (English) |
| Jira / user stories | English preferred; Chinese may appear in parentheses |
| Frontend i18n | Map Preferred Terms to localized UI copy |

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | Java package (`com.finpulse.server`) | Surfaces | API prefix | Notes |
| -------------- | ---- | ------------------------------------- | -------- | ---------- | ----- |
| Auth | 认证 | `auth` | admin / portal / mobile | `/api/v1/auth` | Login, register, session |
| Customer | 客户 | `customer` | admin / portal | `/api/v1/customers` | Retail / advisory client |
| Account | 账户 | `account` | admin / portal / mobile | `/api/v1/accounts` | Cash / brokerage account |
| Instrument | 标的 | `instrument` | all | `/api/v1/instruments` | Equity and other listed instruments |
| Bond | 债券 | `bond` | admin / portal | `/api/v1/bonds` | Fixed income extension |
| Option | 期权 | `option` | admin / portal | `/api/v1/options` | Derivatives extension |
| Portfolio | 组合 | `portfolio` | all | `/api/v1/portfolios` | Holdings container |
| Position | 持仓 | `position` | all | `/api/v1/positions` | Quantity in a portfolio |
| Watchlist | 自选 | `watchlist` | portal / mobile | `/api/v1/watchlists` | Saved symbols |
| WatchlistItem | 自选明细 | `watchlistitem` | portal / mobile | `/api/v1/watchlist-items` | Symbol row |
| Quote | 行情 | `quote` + Python | all | `/api/v1/quotes` | Java CRUD; Python live/history |
| Order | 委托 | `order` | portal / mobile / admin | `/api/v1/orders` | Order ticket |
| Trade | 成交 | `trade` | admin / portal | `/api/v1/trades` | Execution |
| Payment | 支付 | `payment` | mobile / admin | `/api/v1/payments` | Funding / payout |
| Settlement | 清算 | `settlement` | admin | `/api/v1/settlements` | Settlement instruction |
| CashTransaction | 资金流水 | `cashtransaction` | admin / portal | `/api/v1/cash-transactions` | Ledger cash move |
| MarketData | 市场数据 | `marketdata` | admin | `/api/v1/market-data` | Stored market observations |
| Preference | 偏好 | `preference` | all | `/api/v1/user-preferences` | User preference |
| Blockchain | 区块链演示 | `blockchain` | mobile | blockchain routes | Demo wallet / Sepolia |
| Analytics | 分析 | Python (`apps/server-python`) | admin / portal | `/api/v1` analytics / risk / forecast | VaR, events, MLflow |

---

## 3. Core Entities | 核心实体

| Preferred Term | 中文 | Definition |
| -------------- | ---- | ---------- |
| Customer | 客户 | Person or organization that owns accounts and portfolios |
| Account | 账户 | Financial account belonging to a Customer |
| Instrument | 标的 | Tradable security identified by symbol / id |
| Portfolio | 组合 | Named collection of Positions for a Customer / Account |
| Position | 持仓 | Quantity of an Instrument held in a Portfolio |
| Watchlist | 自选 | Named list of instruments a user follows |
| Order | 委托 | Instruction to buy or sell an Instrument |
| Trade | 成交 | Filled execution against an Order |
| Payment | 支付 | Money movement related to funding or payout |
| Settlement | 清算 | Post-trade settlement of obligations |
| Quote | 行情 | Price snapshot or stream for an Instrument |
| RiskMetric | 风险指标 | Computed risk measure (e.g. VaR) for a Portfolio |

---

## 4. Platforms & Ports | 平台与端口

| Preferred Term | 中文 | Notes |
| -------------- | ---- | ----- |
| Java API | Java API | Primary HTTP entry, default **:8801** (`src/`, Bazel `//:server`) |
| Python Analytics API | Python 分析 API | FastAPI in `apps/server-python`, **:8800** |
| Admin | 管理端 | React + Vite (`apps/admin`), typically :4200 |
| Portal | 门户 | React + Vite (`apps/portal`), typically :3001 |
| Mobile | 移动端 | React Native + Expo (`apps/mobile`) |

---

## 5. Forbidden synonyms | 禁止同义混用

| Prefer | Avoid |
| ------ | ----- |
| Portfolio | Holding book (as entity name) |
| Position | Holding (as entity name when Position is meant) |
| Watchlist | Favorites list |
| Instrument | Stock (when the type may not be equity) |
| Customer | User (when meaning the domain Customer) |
