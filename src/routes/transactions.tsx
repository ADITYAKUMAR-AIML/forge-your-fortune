import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Banknote } from "lucide-react";
import { GameShell, PageIntro } from "@/components/game/shell";
import { EmptyNote, Panel, Stat } from "@/components/game/bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/lib/game-context";
import { formatMoney } from "@/game/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Hooker & Millions" },
      {
        name: "description",
        content:
          "The full ledger of your fictional empire: every purchase, payout, trade and expense with the running balance after it.",
      },
      { property: "og:title", content: "Transactions — Hooker & Millions" },
      {
        property: "og:description",
        content: "Search and filter every money movement in your fictional fortune.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/transactions" },
    ],
    links: [{ rel: "canonical", href: "/transactions" }],
  }),
  component: TransactionsPage,
});

function label(type: string) {
  return type.replace(/_/g, " ");
}

function TransactionsPage() {
  const { state } = useGameContext();
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const types = useMemo(
    () => ["All", ...Array.from(new Set(state.transactionHistory.map((item) => item.type)))],
    [state.transactionHistory],
  );

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...state.transactionHistory]
      .reverse()
      .filter((item) => (type === "All" ? true : item.type === type))
      .filter((item) =>
        search
          ? item.description.toLowerCase().includes(search) ||
            label(item.type).toLowerCase().includes(search)
          : true,
      );
  }, [state.transactionHistory, type, query]);

  const totals = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    for (const item of rows) {
      if (item.amount >= 0) inflow += item.amount;
      else outflow += Math.abs(item.amount);
    }
    return { inflow, outflow };
  }, [rows]);

  return (
    <GameShell title="Transactions" subtitle="Every coin in and out">
      <PageIntro
        icon={Banknote}
        text="The ledger records each money movement with the day it happened and your cash balance immediately after."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Entries shown" value={String(rows.length)} />
        <Stat label="Money in" value={formatMoney(totals.inflow)} tone="up" />
        <Stat label="Money out" value={formatMoney(totals.outflow)} tone="down" />
      </div>

      <Panel
        title="Ledger"
        action={
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search descriptions"
            aria-label="Search transactions"
            className="w-48 sm:w-64"
          />
        }
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          {types.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={item === type ? "default" : "outline"}
              onClick={() => setType(item)}
              className="capitalize"
            >
              {label(item)}
            </Button>
          ))}
        </div>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Day</th>
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 font-medium">Description</th>
                  <th className="py-2 pr-3 text-right font-medium">Amount</th>
                  <th className="py-2 text-right font-medium">Balance after</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id} className="border-b border-border/30 last:border-0">
                    <td className="tabular py-2 pr-3">{item.day}</td>
                    <td className="py-2 pr-3">
                      <Badge variant="secondary" className="text-[0.65rem] capitalize">
                        {label(item.type)}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{item.description}</td>
                    <td
                      className={cn(
                        "tabular py-2 pr-3 text-right font-medium",
                        item.amount >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {item.amount >= 0 ? "+" : "−"}
                      {formatMoney(Math.abs(item.amount))}
                    </td>
                    <td className="tabular py-2 text-right">{formatMoney(item.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyNote>No transactions match this filter yet.</EmptyNote>
        )}
      </Panel>
    </GameShell>
  );
}
