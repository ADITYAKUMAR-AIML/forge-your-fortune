import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { GameShell, PageIntro } from "@/components/game/shell";
import { EmptyNote, Panel } from "@/components/game/bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/lib/game-context";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Hooker & Millions" },
      {
        name: "description",
        content:
          "Every fictional event that has hit your empire: scandals, windfalls, market swings and the temporary modifiers they left behind.",
      },
      { property: "og:title", content: "Events — Hooker & Millions" },
      {
        property: "og:description",
        content: "A day-by-day log of the random events shaping your fictional fortune.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { state, randomEvent } = useGameContext();
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(state.eventHistory.map((item) => item.category)))],
    [state.eventHistory],
  );

  const rows = useMemo(() => {
    const list = [...state.eventHistory].reverse();
    return category === "All" ? list : list.filter((item) => item.category === category);
  }, [state.eventHistory, category]);

  return (
    <GameShell title="Events" subtitle="What the world threw at you">
      <PageIntro
        icon={ScrollText}
        text="Events fire as days advance. Some move cash or reputation immediately, others leave a timed modifier on the markets or your businesses."
      />

      {state.activeModifiers.length ? (
        <Panel title="Active modifiers" className="mb-4">
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {state.activeModifiers.map((modifier) => (
              <li key={modifier.id} className="rounded-lg border border-gold/40 bg-secondary/40 p-3">
                <p className="text-sm font-medium">{modifier.label}</p>
                <p className="tabular mt-1 text-xs text-muted-foreground">
                  {modifier.daysRemaining} day{modifier.daysRemaining === 1 ? "" : "s"} remaining
                  {modifier.marketModifier
                    ? ` · market ${(modifier.marketModifier * 100).toFixed(0)}%`
                    : ""}
                  {modifier.businessIncomeModifier
                    ? ` · income ${(modifier.businessIncomeModifier * 100).toFixed(0)}%`
                    : ""}
                  {modifier.businessExpenseModifier
                    ? ` · expenses ${(modifier.businessExpenseModifier * 100).toFixed(0)}%`
                    : ""}
                  {modifier.affectedSector ? ` · ${modifier.affectedSector}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel
        title="Event history"
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={item === category ? "default" : "outline"}
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        }
      >
        {rows.length ? (
          <ul className="space-y-3">
            {rows.map((event) => (
              <li
                key={event.id}
                className="border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="tabular text-[0.65rem]">
                    Day {event.day}
                  </Badge>
                  <Badge variant="secondary" className="text-[0.65rem]">
                    {event.category}
                  </Badge>
                  <p className="font-display text-base leading-tight">{event.title}</p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>
            Nothing has happened yet. Advance a few days, or trigger one from Save &amp; DEBUG.
          </EmptyNote>
        )}

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={randomEvent}>
            Trigger a random event
          </Button>
        </div>
      </Panel>
    </GameShell>
  );
}
