import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { GameShell, PageIntro } from "@/components/game/shell";
import { EmptyNote, Panel, notify } from "@/components/game/bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/lib/game-context";
import { investments } from "@/game/data";
import { formatMoney } from "@/game/state";

export const Route = createFileRoute("/investments")({
  head: () => ({
    meta: [
      { title: "Investments — Hooker & Millions" },
      {
        name: "description",
        content:
          "Place capital into fictional funds with different expected returns, risk levels, durations and liquidity — including locked-term positions.",
      },
      { property: "og:title", content: "Investments — Hooker & Millions" },
      {
        property: "og:description",
        content: "Safe ladders to high-risk frontier capital, each maturing over in-game days.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/investments" },
    ],
    links: [{ rel: "canonical", href: "/investments" }],
  }),
  component: InvestmentsPage,
});

function InvestmentsPage() {
  const { state, invest } = useGameContext();
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  return (
    <GameShell title="Investments" subtitle="Capital at work">
      <PageIntro text="Each fund accepts one active position at a time. Returns are randomised within the risk band and pay out when the term matures." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {investments.map((definition) => {
          const active = state.investments.find(
            (position) => position.definitionId === definition.id && position.status === "active",
          );
          const matured = state.investments.filter(
            (position) => position.definitionId === definition.id && position.status === "matured",
          ).length;
          const amount = Number(amounts[definition.id] ?? "");

          return (
            <article key={definition.id} className="panel flex flex-col gap-3 p-4">
              <div>
                <h3 className="font-display text-lg leading-tight">{definition.name}</h3>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[0.65rem]">
                    {definition.type}
                  </Badge>
                  <Badge variant="outline" className="text-[0.65rem]">
                    {definition.liquidity}
                  </Badge>
                  {active ? (
                    <Badge className="bg-gold text-gold-foreground text-[0.65rem]">Active</Badge>
                  ) : null}
                  {matured ? (
                    <Badge variant="outline" className="text-[0.65rem]">
                      {matured} matured
                    </Badge>
                  ) : null}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {definition.description}
              </p>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <dt className="text-muted-foreground">Minimum capital</dt>
                  <dd className="tabular font-medium">{formatMoney(definition.minimumCapital)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Expected return</dt>
                  <dd className="tabular font-medium text-success">
                    {(definition.expectedReturn * 100).toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Risk band</dt>
                  <dd className="tabular font-medium">±{(definition.risk * 100).toFixed(0)}%</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="tabular font-medium">{definition.duration} days</dd>
                </div>
              </dl>

              {active ? (
                <div className="rounded-lg border border-gold/40 bg-secondary/40 p-3 text-xs">
                  <p className="tabular">
                    {formatMoney(active.principal)} placed on day {active.startedDay} —{" "}
                    {active.daysRemaining} day{active.daysRemaining === 1 ? "" : "s"} remaining.
                  </p>
                  {definition.liquidity === "Locked" ? (
                    <p className="mt-1 flex items-center gap-1.5 text-warning">
                      <Lock className="size-3" aria-hidden />
                      Capital is locked until the term matures.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-auto flex gap-2 pt-1">
                <Input
                  type="number"
                  min={definition.minimumCapital}
                  placeholder={`Min ${definition.minimumCapital}`}
                  aria-label={`Amount for ${definition.name}`}
                  value={amounts[definition.id] ?? ""}
                  onChange={(event) =>
                    setAmounts((prev) => ({ ...prev, [definition.id]: event.target.value }))
                  }
                  disabled={Boolean(active)}
                />
                <Button
                  disabled={Boolean(active)}
                  onClick={() => {
                    if (!Number.isFinite(amount) || amount < definition.minimumCapital) {
                      notify(
                        false,
                        "",
                        `Minimum capital for this fund is ${formatMoney(definition.minimumCapital)}.`,
                      );
                      return;
                    }
                    notify(
                      invest(definition.id, amount),
                      `${formatMoney(amount)} placed into ${definition.name}.`,
                      `Not enough cash to place ${formatMoney(amount)}.`,
                    );
                  }}
                >
                  {active ? "In progress" : "Invest"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Panel title="Position history" className="mt-4">
        {state.investments.length ? (
          <ul className="space-y-2 text-sm">
            {state.investments.map((position) => {
              const definition = investments.find((item) => item.id === position.definitionId);
              return (
                <li
                  key={position.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                >
                  <span>{definition?.name ?? position.definitionId}</span>
                  <span className="tabular text-xs text-muted-foreground">
                    {formatMoney(position.principal)} · started day {position.startedDay} ·{" "}
                    {position.status === "active"
                      ? `${position.daysRemaining} days left`
                      : "matured"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyNote>No capital has been placed yet.</EmptyNote>
        )}
      </Panel>
    </GameShell>
  );
}
