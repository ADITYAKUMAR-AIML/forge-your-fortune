# Hooker & Millions — bring the repo in and finish the last three screens

Yes, I read it and I understand it. I also pulled the GitHub project (`fortune-forge-99`) and checked what's actually in it, so here's the accurate state.

## Where things really stand

This workspace is the blank starter again — none of the game files are here. But the GitHub repo already contains everything the previous session did:

- Game engine, economy, save/load, state, and all data sets (characters, businesses, stocks, investments, properties, assets, lifestyles, events).
- The `useGame` hook including the two debug additions (`forceMarket`, `adjustMoney`) and save export/import.
- The luxury theme tokens (black, burgundy, deep magenta, dark purple, silver/white, gold, glass/glow utilities) and the display/body font variables.
- The game shell components and the screens: Dashboard (at `/`), Acquire, Businesses, Stock Market, Investments, Properties, Assets.
- Local placeholder images under `public/assets/`.

Confirmed missing in the repo: route files for Events, Transactions, and Save & DEBUG. The navigation links to them, so the app won't build until they exist. Root metadata still says "Lovable App", the toast host isn't mounted, and the two fonts aren't loaded.

## What gets built

1. **Import the repo into this workspace** — game engine, data, hook, components, routes, styles, and `public/assets/`, excluding any git metadata and keeping the existing starter config intact.
2. **Events screen** — activity list of triggered events by day: title, category, description, money effect, and any modifier it applied, newest first, with an empty state before anything happens.
3. **Transactions screen** — ledger of every money movement: day, category, description, amount in/out, balance after; filter by category and search by description.
4. **Save & DEBUG screen** — export save to file, import from file, reset game, last-saved status; DEBUG block with manual day advance, money adjustment, force market condition, trigger random event, and a collapsible raw state inspector.
5. **Finishing touches** — real title/description/OG/Twitter metadata on the home route and generic root metadata replaced, toast host mounted once at the root, the two display/body fonts loaded via a stylesheet link, roadmap updated.
6. **Verification** — walk every screen in the browser, try an unaffordable purchase, a duplicate purchase, a locked item, fractional shares, an early locked-term withdrawal; advance several days to see income, expenses, events and lifestyle change; export/import/reset a save; force a market condition; adjust debug money; check the narrow layout and console diagnostics.

## Technical notes

- New routes are siblings under the existing shell layout, each with its own `head()`; nav links already point at `/events`, `/transactions`, `/save`.
- All three new screens read from the existing `useGame` state and call only existing hook actions — no engine changes, so all guardrails stay in one place. Every action returns pass/fail and raises a toast.
- Fonts load through a `<link>` in the root route, not a CSS import.
- Still frontend-only: no backend, auth, database, or network calls. Persistence is localStorage; export/import use browser file APIs.
