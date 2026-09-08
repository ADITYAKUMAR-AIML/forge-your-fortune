import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BadgeDollarSign,
  Banknote,
  Building2,
  CalendarClock,
  Car,
  Gem,
  Home,
  LineChart,
  Menu,
  PiggyBank,
  Save,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/lib/game-context";
import { formatMoney } from "@/game/state";
import { lifestyles } from "@/game/data";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/acquire", label: "Acquire", icon: Sparkles },
  { to: "/businesses", label: "Businesses", icon: Building2 },
  { to: "/stocks", label: "Stock Market", icon: LineChart },
  { to: "/investments", label: "Investments", icon: PiggyBank },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/assets", label: "Assets", icon: Car },
  { to: "/events", label: "Events", icon: ScrollText },
  { to: "/transactions", label: "Transactions", icon: Banknote },
  { to: "/save", label: "Save & DEBUG", icon: Save },
] as const;

function StatusChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "gold" | "magenta";
}) {
  return (
    <div className="panel rounded-lg px-3 py-1.5">
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "tabular text-sm font-semibold",
          tone === "gold" && "text-gold",
          tone === "magenta" && "text-magenta",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function GameShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { state, hydrated, nextDay } = useGameContext();
  const [navOpen, setNavOpen] = useState(false);
  const lifestyle = lifestyles.find((item) => item.id === state.player.lifestyle);

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setNavOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground data-[status=active]:shadow-[inset_2px_0_0_var(--gold)]"
          activeOptions={{ exact: to === "/" }}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="glitter min-h-screen">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r border-border/70 bg-sidebar/80 px-4 py-6 backdrop-blur-xl lg:flex">
          <div>
            <p className="font-display text-xl leading-tight text-gradient-gold">
              Hooker &amp; Millions
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
              Fictional empire sim
            </p>
          </div>
          {nav}
          <p className="mt-auto text-[0.65rem] leading-relaxed text-muted-foreground">
            Fiction only. Every character is an adult, 18 or older, and all content is
            non-explicit.
          </p>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
                onClick={() => setNavOpen(true)}
              >
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
              <Button
                onClick={nextDay}
                className="glow-magenta shrink-0 bg-primary font-semibold hover:bg-primary/90"
              >
                <CalendarClock className="mr-2 size-4" />
                Advance day
              </Button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7">
              <StatusChip label="Day" value={hydrated ? String(state.currentDay) : "—"} />
              <StatusChip label="Lifestyle" value={lifestyle?.label ?? "Low"} tone="magenta" />
              <StatusChip label="Reputation" value={String(state.player.reputation)} />
              <StatusChip label="Cash" value={formatMoney(state.player.cash)} tone="gold" />
              <StatusChip label="Bank" value={formatMoney(state.player.bankBalance)} />
              <StatusChip label="Net worth" value={formatMoney(state.netWorth)} tone="gold" />
              <StatusChip label="Market" value={state.marketCondition} />
            </div>
          </header>

          <main className="px-4 py-6">{children}</main>
        </div>
      </div>

      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85%] flex-col gap-6 border-r border-border bg-sidebar px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-gradient-gold">Hooker &amp; Millions</p>
              <Button variant="ghost" size="icon" onClick={() => setNavOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PageIntro({ icon: Icon, text }: { icon?: typeof BadgeDollarSign; text: string }) {
  return (
    <p className="mb-5 flex items-start gap-2 text-sm text-muted-foreground">
      {Icon ? <Icon className="mt-0.5 size-4 text-gold" aria-hidden /> : <Gem className="mt-0.5 size-4 text-gold" aria-hidden />}
      <span>{text}</span>
    </p>
  );
}
