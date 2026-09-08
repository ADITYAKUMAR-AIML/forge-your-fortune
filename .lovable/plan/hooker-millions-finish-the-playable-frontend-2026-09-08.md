# Hooker & Millions — finish the playable frontend

Yes, I understand it. I pulled the GitHub project and read the engine, data, save system, and the `useGame` hook. One important thing you should know: this workspace is currently the **blank starter** — none of the game files exist here yet (no `src/game/*`, no `src/lib/use-game.ts`, no `public/assets/*`). So step one is bringing the repo's game foundation in, then building the screens on top of it.

## What already works (from the repo)

- Full engine: day advance with business income, expense modifiers, stock price movement, random events, timed modifiers, investment maturity, lifestyle promotion/demotion.
- Guarded economy: `addMoney` / `removeMoney` refuse insufficient funds; duplicate purchases, unmet requirements, non-integer shares, oversell, and minimum-capital rules are already blocked.
- Data sets for characters, businesses, stocks, investments, properties, assets, lifestyles, events; local placeholder `.webp` images for each catalogue path.
- localStorage save/load/reset plus a `useGame` hook exposing buy/upgrade/invest/trade/deposit/withdraw/nextDay/randomEvent/reset.

## What gets built

1. **Foundation import** — copy the repo's `src/game/`, `src/lib/use-game.ts`, and `public/assets/` into this project unchanged, plus its shadcn components already present here.
2. **Game shell** — persistent left navigation and a compact top status bar (day, lifestyle, reputation, cash, bank, net worth, market condition, "Advance day"). Collapses to a drawer nav and stacked status chips on narrow screens.
3. **Screens**, each its own route under the shell:
   - Dashboard — wealth summary, income/expense pulse, progress to next lifestyle, active modifiers, recent events, recent transactions.
   - Acquire — catalogue-only, 18+, strictly non-explicit; search plus country/category/tier/rarity/price filters, sorting, locked/available/owned states with requirement text.
   - Businesses — buy cards, level, daily income/cost, scaled upgrade cost, upgrade action.
   - Stock Market — market condition, sector/company rows, live prices, risk/volatility, owned shares, average cost, profit/loss, integer-validated buy/sell.
   - Investments — principal input, type, expected return/risk, duration, liquidity, active/matured status, locked-term messaging.
   - Properties and Assets — shared catalogue card with price, maintenance, lifestyle/reputation bonus, requirements, ownership.
   - Events and Transactions — readable activity lists with day, category, description, amount, balance after.
   - Save & DEBUG — export/import/reset, last-saved status, manual day advance, money adjustment, force market condition, trigger random event, collapsible state inspector labeled DEBUG.
4. **Hook extensions only where needed** — `forceMarket(condition)` and a debug-only `adjustMoney(amount)` that still records a transaction and recalculates net worth; everything else keeps routing through the existing engine functions. Every action returns success/failure and shows a toast so rejections are visible.
5. **Visual direction** — black, burgundy, deep magenta, dark purple, silver/white with gold highlights, all as tokens in `src/styles.css`; glass panels, glowing borders, restrained glitter texture and motion that never sits on top of controls.
6. **Metadata and roadmap** — Hooker & Millions title/description/OG/Twitter on the home route, generic Lovable root metadata replaced, roadmap updated.

## Technical notes

- Shell lives in a layout route; Dashboard replaces `src/routes/index.tsx` (placeholder removed). Sibling routes for each screen, each with its own `head()`.
- `useGame` is client state; the shell reads browser storage after hydration to avoid SSR mismatch. Mutating actions wrap the existing engine calls through the hook's `mutate`, so the guardrails stay in one place.
- No backend, auth, database, or network calls. Persistence is localStorage; export/import use browser file APIs only. All imagery is local under `public/assets/`.

## Verification

Open `/`, walk every screen, try buying with too little cash, a duplicate purchase, a locked item, fractional shares, an early locked-term withdrawal, advance several days to see income/expenses/events/lifestyle change, export/import/reset a save, force a market condition, adjust debug money, then check narrow layout, console diagnostics, and a production build.
