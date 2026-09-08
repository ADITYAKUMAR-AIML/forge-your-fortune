import { createFileRoute } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import { GameShell } from "@/components/game/shell";
import { EmptyNote, Panel, Stat } from "@/components/game/bits";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/lib/game-context";
import { formatMoney } from "@/game/state";
import { lifestyles } from "@/game/data";
import { calculateDailyExpenses } from "@/game/economy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hooker & Millions — Luxury Empire Simulator" },
      {
        name: "description",
        content:
          "Build a fictional luxury empire: businesses, stocks, investments, properties and assets across an evolving in-game market. Offline, browser-only, 18+ fiction.",
      },
      { property: "og:title", content: "Hooker & Millions — Luxury Empire Simulator" },
      {
        property: "og:description",
        content:
          "Run a fictional wealth empire day by day — businesses, market trading, investments, properties and assets, all in your browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state } = useGameContext();
  const currentIndex = lifestyles.findIndex((item) => item.id === state.player.lifestyle);
  const current = lifestyles[currentIndex];
  const next = lifestyles[currentIndex + 1];
  const progress = next
    ? Math.min(100, Math.round((state.netWorth / next.minimumNetWorth) * 100))
    : 100;
  const projectedExpenses = calculateDailyExpenses(state);
  const netDaily = state.dailyIncome - state.dailyExpenses;

  return (
    <GameShell title="Dashboard" subtitle="Your empire at a glance">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Net worth" value={formatMoney(state.netWorth)} tone="gold" />
        <Stat
          label="Liquid cash"
          value={formatMoney(state.player.cash)}
          hint={`${formatMoney(state.player.bankBalance)} banked`}
        />
        <Stat
          label="Income last day"
          value={formatMoney(state.dailyIncome)}
          tone="up"
          hint={`${Object.keys(state.ownedBusinesses).length} businesses running`}
        />
        <Stat
          label="Expenses last day"
          value={formatMoney(state.dailyExpenses)}
          tone="down"
          hint={`${formatMoney(projectedExpenses)} projected tomorrow`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Income pulse" className="lg:col-span-1">
          <p
            className={`tabular flex items-center gap-2 text-2xl font-semibold ${netDaily >= 0 ? "text-success" : "text-destructive"}`}
          >
            {netDaily >= 0 ? (
              <TrendingUp className="size-5" aria-hidden />
            ) : (
              <TrendingDown className="size-5" aria-hidden />
            )}
            {formatMoney(netDaily)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Net movement on the last advanced day.</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Reputation</dt>
              <dd className="tabular font-medium">{state.player.reputation}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Market condition</dt>
              <dd className="font-medium text-magenta">{state.marketCondition}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Collection</dt>
              <dd className="tabular font-medium">{state.ownedCharacters.length} entries</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Properties &amp; assets</dt>
              <dd className="tabular font-medium">
                {state.ownedProperties.length} / {state.ownedAssets.length}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Lifestyle progression" className="lg:col-span-2">
          <p className="text-sm">
            Currently living <span className="font-semibold text-gold">{current?.label}</span>
            {next ? (
              <>
                {" "}
                — next tier <span className="font-semibold text-magenta">{next.label}</span> at{" "}
                {formatMoney(next.minimumNetWorth)} net worth and {(currentIndex + 1) * 8}{" "}
                reputation.
              </>
            ) : (
              " — the highest tier in the game."
            )}
          </p>
          <Progress value={progress} className="mt-4 h-2" />
          <p className="tabular mt-2 text-xs text-muted-foreground">{progress}% of the way there</p>

          <h3 className="mt-6 text-sm font-semibold">Active modifiers</h3>
          {state.activeModifiers.length ? (
            <ul className="mt-2 space-y-2">
              {state.activeModifiers.map((modifier) => (
                <li
                  key={modifier.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs"
                >
                  <span>{modifier.label}</span>
                  <Badge variant="outline" className="tabular">
                    {modifier.daysRemaining}d left
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              No temporary effects are active right now.
            </p>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Recent events">
          {state.eventHistory.length ? (
            <ul className="space-y-3">
              {state.eventHistory.slice(0, 6).map((event) => (
                <li key={event.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className="tabular text-xs text-muted-foreground">Day {event.day}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>Advance a day to start generating events.</EmptyNote>
          )}
        </Panel>

        <Panel title="Recent transactions">
          {state.transactionHistory.length ? (
            <ul className="space-y-2">
              {state.transactionHistory.slice(0, 8).map((transaction) => (
                <li key={transaction.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">{transaction.description}</span>
                  <span
                    className={`tabular shrink-0 font-medium ${transaction.amount >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {formatMoney(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No money has moved yet.</EmptyNote>
          )}
        </Panel>
      </div>
    </GameShell>
  );
}
