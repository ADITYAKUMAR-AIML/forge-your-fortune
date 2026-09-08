import { createFileRoute } from "@tanstack/react-router";
import { GameShell, PageIntro } from "@/components/game/shell";
import { CatalogueCard, affordabilityMessage, notify, requirementLabel } from "@/components/game/bits";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/lib/game-context";
import { businesses } from "@/game/data";
import { formatMoney, meetsRequirement } from "@/game/state";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Businesses — Hooker & Millions" },
      {
        name: "description",
        content:
          "Buy and upgrade fictional businesses that pay daily income, carry operating costs and scale with every level you invest in.",
      },
      { property: "og:title", content: "Businesses — Hooker & Millions" },
      {
        property: "og:description",
        content: "Daily income, operating costs and escalating upgrade paths for each venture.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/businesses" },
    ],
    links: [{ rel: "canonical", href: "/businesses" }],
  }),
  component: BusinessesPage,
});

function BusinessesPage() {
  const { state, buyBusiness, upgradeBusiness } = useGameContext();

  return (
    <GameShell title="Businesses" subtitle="Daily income engines">
      <PageIntro text="Businesses pay income every time you advance a day and charge operating costs that grow with each level." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {businesses.map((business) => {
          const owned = state.ownedBusinesses[business.id];
          const locked = !meetsRequirement(state, business.unlockRequirement);
          const level = owned?.level ?? 0;
          const upgradeCost = Math.round(
            business.upgradeCost * Math.pow(1.45, Math.max(0, level - 1)),
          );
          const income = business.baseIncome + business.incomeGrowth * Math.max(0, level - 1);

          return (
            <CatalogueCard
              key={business.id}
              image={business.image}
              name={business.name}
              badges={[business.category, owned ? `Level ${level}` : "Not owned"]}
              rows={[
                {
                  label: "Daily income",
                  value: formatMoney(owned ? income : business.baseIncome),
                },
                { label: "Operating cost", value: formatMoney(business.operatingCost) },
                { label: "Upgrade cost", value: formatMoney(upgradeCost) },
                { label: "Income per level", value: formatMoney(business.incomeGrowth) },
              ]}
              price={business.purchasePrice}
              owned={Boolean(owned)}
              locked={locked}
              requirement={requirementLabel(business.unlockRequirement)}
              actionLabel="Open business"
              onAction={() =>
                notify(
                  buyBusiness(business.id),
                  `${business.name} is now yours.`,
                  affordabilityMessage(state, business.purchasePrice, locked),
                )
              }
              footer={
                owned ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/50 text-gold hover:bg-gold/10"
                    onClick={() =>
                      notify(
                        upgradeBusiness(business.id),
                        `${business.name} upgraded to level ${level + 1}.`,
                        `Not enough cash — an upgrade costs ${formatMoney(upgradeCost)}.`,
                      )
                    }
                  >
                    Upgrade to level {level + 1} · {formatMoney(upgradeCost)}
                  </Button>
                ) : null
              }
            />
          );
        })}
      </div>
    </GameShell>
  );
}
