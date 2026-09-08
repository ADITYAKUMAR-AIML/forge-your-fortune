import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell, PageIntro } from "@/components/game/shell";
import { Panel, Stat, notify } from "@/components/game/bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/lib/game-context";
import { stocks } from "@/game/data";
import { formatMoney, getStockPrice } from "@/game/state";

export const Route = createFileRoute("/stocks")({
  head: () => ({
    meta: [
      { title: "Stock Market — Hooker & Millions" },
      {
        name: "description",
        content:
          "Trade fictional companies across sectors with live in-game prices, volatility, risk ratings and a running profit and loss on every position.",
      },
      { property: "og:title", content: "Stock Market — Hooker & Millions" },
      {
        property: "og:description",
        content: "Sector prices move every day with market conditions and random events.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/stocks" },
    ],
    links: [{ rel: "canonical", href: "/stocks" }],
  }),
  component: StocksPage,
});

function StocksPage() {
  const { state, buyStock, sellStock } = useGameContext();
  const [shares, setShares] = useState<Record<string, string>>({});

  const parseShares = (id: string) => {
    const raw = shares[id] ?? "";
    const value = Number(raw);
    return Number.isInteger(value) && value > 0 ? value : null;
  };

  const portfolioValue = Object.entries(state.stockPortfolio).reduce(
    (total, [id, position]) => total + position.shares * getStockPrice(state, id),
    0,
  );
  const portfolioCost = Object.values(state.stockPortfolio).reduce(
    (total, position) => total + position.shares * position.averagePurchasePrice,
    0,
  );
  const profit = portfolioValue - portfolioCost;

  return (
    <GameShell title="Stock Market" subtitle={`Market condition: ${state.marketCondition}`}>
      <PageIntro text="Prices update every time you advance a day. Only whole shares can be traded, and you can never sell more than you hold." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Portfolio value" value={formatMoney(portfolioValue)} tone="gold" />
        <Stat label="Cost basis" value={formatMoney(portfolioCost)} />
        <Stat
          label="Unrealised P/L"
          value={formatMoney(profit)}
          tone={profit >= 0 ? "up" : "down"}
        />
      </div>

      <Panel title="Companies" className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 pr-3">Company</th>
              <th className="pb-2 pr-3">Sector</th>
              <th className="pb-2 pr-3 text-right">Price</th>
              <th className="pb-2 pr-3">Risk</th>
              <th className="pb-2 pr-3 text-right">Volatility</th>
              <th className="pb-2 pr-3 text-right">Shares</th>
              <th className="pb-2 pr-3 text-right">Avg cost</th>
              <th className="pb-2 pr-3 text-right">P/L</th>
              <th className="pb-2 text-right">Trade</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const price = getStockPrice(state, stock.id);
              const position = state.stockPortfolio[stock.id];
              const rowProfit = position
                ? (price - position.averagePurchasePrice) * position.shares
                : 0;
              return (
                <tr key={stock.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-3">
                    <span className="font-semibold text-gold">{stock.symbol}</span>
                    <span className="block text-xs text-muted-foreground">{stock.companyName}</span>
                  </td>
                  <td className="py-3 pr-3 text-xs text-muted-foreground">{stock.sector}</td>
                  <td className="tabular py-3 pr-3 text-right font-medium">{formatMoney(price)}</td>
                  <td className="py-3 pr-3">
                    <Badge
                      variant={stock.risk === "High" ? "destructive" : "secondary"}
                      className="text-[0.65rem]"
                    >
                      {stock.risk}
                    </Badge>
                  </td>
                  <td className="tabular py-3 pr-3 text-right text-xs">
                    {(stock.volatility * 100).toFixed(1)}%
                  </td>
                  <td className="tabular py-3 pr-3 text-right">{position?.shares ?? 0}</td>
                  <td className="tabular py-3 pr-3 text-right">
                    {position ? formatMoney(position.averagePurchasePrice) : "—"}
                  </td>
                  <td
                    className={`tabular py-3 pr-3 text-right ${rowProfit >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {position ? formatMoney(rowProfit) : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        placeholder="Qty"
                        aria-label={`Shares of ${stock.symbol}`}
                        className="w-20"
                        value={shares[stock.id] ?? ""}
                        onChange={(event) =>
                          setShares((prev) => ({ ...prev, [stock.id]: event.target.value }))
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const quantity = parseShares(stock.id);
                          if (!quantity) {
                            notify(false, "", "Enter a whole number of shares above zero.");
                            return;
                          }
                          notify(
                            buyStock(stock.id, quantity),
                            `Bought ${quantity} ${stock.symbol} at ${formatMoney(price)}.`,
                            `Not enough cash — ${quantity} shares cost ${formatMoney(price * quantity)}.`,
                          );
                        }}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const quantity = parseShares(stock.id);
                          if (!quantity) {
                            notify(false, "", "Enter a whole number of shares above zero.");
                            return;
                          }
                          notify(
                            sellStock(stock.id, quantity),
                            `Sold ${quantity} ${stock.symbol} for ${formatMoney(price * quantity)}.`,
                            `You only hold ${position?.shares ?? 0} ${stock.symbol} shares.`,
                          );
                        }}
                      >
                        Sell
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </GameShell>
  );
}
