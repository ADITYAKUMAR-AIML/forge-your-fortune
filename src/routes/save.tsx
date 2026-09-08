import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bug, Download, RotateCcw, Save, Upload } from "lucide-react";
import { GameShell, PageIntro } from "@/components/game/shell";
import { Panel, notify } from "@/components/game/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/lib/game-context";
import { formatMoney } from "@/game/state";
import type { MarketCondition } from "@/game/types";

export const Route = createFileRoute("/save")({
  head: () => ({
    meta: [
      { title: "Save & DEBUG — Hooker & Millions" },
      {
        name: "description",
        content:
          "Export, import or reset your local save, and use the DEBUG tools to advance days, adjust money, force a market condition or trigger an event.",
      },
      { property: "og:title", content: "Save & DEBUG — Hooker & Millions" },
      {
        property: "og:description",
        content: "Local save management and developer controls for the fictional empire sim.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/save" },
    ],
    links: [{ rel: "canonical", href: "/save" }],
  }),
  component: SavePage,
});

const marketConditions: MarketCondition[] = ["Normal", "Bull", "Bear", "Boom", "Crash"];

function SavePage() {
  const game = useGameContext();
  const { state, hydrated } = game;
  const fileRef = useRef<HTMLInputElement>(null);
  const [adjustment, setAdjustment] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const lastSaved = hydrated && state.lastSavedAt ? new Date(state.lastSavedAt) : null;

  return (
    <GameShell title="Save & DEBUG" subtitle="Your progress lives in this browser">
      <PageIntro
        icon={Save}
        text="The game saves automatically to this browser after every action. Export a file to keep a backup or move your run to another device."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Save file">
          <p className="tabular text-sm text-muted-foreground">
            Day {hydrated ? state.currentDay : "—"} · Net worth {formatMoney(state.netWorth)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {lastSaved
              ? `Last saved ${lastSaved.toLocaleString()}`
              : "Not saved yet in this browser."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                game.exportSave();
                notify(true, "Save exported as a JSON file.", "");
              }}
            >
              <Download className="mr-2 size-4" />
              Export save
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 size-4" />
              Import save
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              aria-label="Import save file"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  await game.importSave(file);
                  notify(true, "Save imported.", "");
                } catch {
                  notify(false, "", "That file could not be read as a save.");
                }
              }}
            />
            <Button
              variant="destructive"
              onClick={() => {
                game.reset();
                notify(true, "Game reset to day 1.", "");
              }}
            >
              <RotateCcw className="mr-2 size-4" />
              Reset game
            </Button>
          </div>
        </Panel>

        <Panel title="DEBUG">
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Bug className="mt-0.5 size-4 text-gold" aria-hidden />
            <span>
              Developer controls. Everything here still runs through the game engine, so the same
              rules and transaction logging apply.
            </span>
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Time and events
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => game.nextDay()}>
                  Advance one day
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    notify(game.randomEvent(), "A random event fired.", "No event fired this time.")
                  }
                >
                  Trigger random event
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Money adjustment
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={adjustment}
                  onChange={(event) => setAdjustment(event.target.value)}
                  placeholder="e.g. 50000 or -2500"
                  aria-label="Money adjustment amount"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const amount = Number(adjustment);
                    notify(
                      game.adjustMoney(amount),
                      `Cash adjusted by ${formatMoney(amount)}.`,
                      "Enter a non-zero amount you can actually apply.",
                    );
                    setAdjustment("");
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Force market condition
              </p>
              <div className="flex flex-wrap gap-1.5">
                {marketConditions.map((condition) => (
                  <Button
                    key={condition}
                    size="sm"
                    variant={state.marketCondition === condition ? "default" : "outline"}
                    onClick={() =>
                      notify(
                        game.forceMarket(condition),
                        `Market forced to ${condition}.`,
                        "That market condition could not be applied.",
                      )
                    }
                  >
                    {condition}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="State inspector"
        className="mt-4"
        action={
          <Button size="sm" variant="outline" onClick={() => setInspectorOpen((open) => !open)}>
            {inspectorOpen ? "Hide" : "Show"} DEBUG state
          </Button>
        }
      >
        {inspectorOpen ? (
          <pre className="tabular max-h-96 overflow-auto rounded-lg bg-secondary/40 p-3 text-[0.7rem] leading-relaxed">
            {JSON.stringify(state, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            The raw game state is hidden. Show it to inspect every value the engine tracks.
          </p>
        )}
      </Panel>
    </GameShell>
  );
}
