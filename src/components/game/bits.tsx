import type { ReactNode } from "react";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/game/state";
import type { GameState, UnlockRequirement } from "@/game/types";
import { lifestyles } from "@/game/data";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("panel p-4 sm:p-5", className)}>
      {title ? (
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-silver">{title}</h2>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "gold" | "up" | "down";
}) {
  return (
    <div className="panel panel-gold p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "tabular mt-1 text-xl font-semibold sm:text-2xl",
          tone === "gold" && "text-gold",
          tone === "up" && "text-success",
          tone === "down" && "text-destructive",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function requirementLabel(requirement?: UnlockRequirement) {
  if (!requirement) return null;
  const parts: string[] = [];
  if (requirement.reputation !== undefined) parts.push(`${requirement.reputation} reputation`);
  if (requirement.netWorth !== undefined)
    parts.push(`${formatMoney(requirement.netWorth)} net worth`);
  if (requirement.lifestyle !== undefined)
    parts.push(
      `${lifestyles.find((item) => item.id === requirement.lifestyle)?.label ?? requirement.lifestyle} lifestyle`,
    );
  if (requirement.day !== undefined) parts.push(`day ${requirement.day}`);
  return parts.length ? `Requires ${parts.join(", ")}` : null;
}

export function notify(success: boolean, okMessage: string, failMessage: string) {
  if (success) toast.success(okMessage);
  else toast.error(failMessage);
}

export function affordabilityMessage(state: GameState, price: number, locked: boolean) {
  if (locked) return "Requirements not met yet.";
  if (state.player.cash < price) return `Not enough cash — you need ${formatMoney(price)}.`;
  return "That action was rejected.";
}

export interface CatalogueRow {
  label: string;
  value: string;
}

export function CatalogueCard({
  image,
  name,
  badges,
  description,
  rows,
  price,
  owned,
  locked,
  requirement,
  actionLabel,
  onAction,
  footer,
}: {
  image?: string;
  name: string;
  badges?: string[];
  description?: string;
  rows: CatalogueRow[];
  price: number;
  owned: boolean;
  locked: boolean;
  requirement?: string | null;
  actionLabel: string;
  onAction: () => void;
  footer?: ReactNode;
}) {
  return (
    <article
      className={cn(
        "panel flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5",
        owned && "panel-gold",
        locked && !owned && "opacity-80",
      )}
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={cn("size-full object-cover", locked && !owned && "grayscale")}
          />
          {locked && !owned ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Lock className="size-6 text-gold" aria-hidden />
            </div>
          ) : null}
          {owned ? (
            <Badge className="absolute right-2 top-2 bg-gold text-gold-foreground">
              <Check className="mr-1 size-3" /> Owned
            </Badge>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg leading-tight">{name}</h3>
          {badges?.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-[0.65rem]">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="tabular font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>

        {requirement && locked && !owned ? (
          <p className="text-xs text-warning">{requirement}</p>
        ) : null}

        {footer}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="tabular font-semibold text-gold">{formatMoney(price)}</span>
          <Button
            size="sm"
            onClick={onAction}
            disabled={owned || locked}
            className="bg-primary hover:bg-primary/90"
          >
            {owned ? "Owned" : locked ? "Locked" : actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="panel p-6 text-center text-sm text-muted-foreground">{children}</p>
  );
}
