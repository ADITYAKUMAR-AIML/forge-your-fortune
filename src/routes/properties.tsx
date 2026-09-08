import { createFileRoute } from "@tanstack/react-router";
import { GameShell, PageIntro } from "@/components/game/shell";
import { CatalogueCard, affordabilityMessage, notify, requirementLabel } from "@/components/game/bits";
import { useGameContext } from "@/lib/game-context";
import { properties } from "@/game/data";
import { formatMoney, meetsRequirement } from "@/game/state";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Hooker & Millions" },
      {
        name: "description",
        content:
          "Buy fictional apartments, houses and penthouses that raise lifestyle and reputation while adding daily maintenance costs.",
      },
      { property: "og:title", content: "Properties — Hooker & Millions" },
      {
        property: "og:description",
        content: "Each address carries maintenance costs and unlock requirements.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { state, buyProperty } = useGameContext();

  return (
    <GameShell title="Properties" subtitle="Addresses that raise your standing">
      <PageIntro text="Properties add reputation immediately and maintenance costs every day. Higher tiers unlock as your lifestyle and net worth climb." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {properties.map((property) => {
          const owned = state.ownedProperties.includes(property.id);
          const locked = !meetsRequirement(state, property.unlockRequirement);
          return (
            <CatalogueCard
              key={property.id}
              image={property.image}
              name={property.name}
              badges={[property.category]}
              rows={[
                { label: "Daily maintenance", value: formatMoney(property.maintenanceCost) },
                { label: "Lifestyle bonus", value: `+${property.lifestyleBonus}` },
                { label: "Reputation bonus", value: `+${property.reputationBonus}` },
              ]}
              price={property.price}
              owned={owned}
              locked={locked}
              requirement={requirementLabel(property.unlockRequirement)}
              actionLabel="Purchase"
              onAction={() =>
                notify(
                  buyProperty(property.id),
                  `${property.name} purchased.`,
                  affordabilityMessage(state, property.price, locked),
                )
              }
            />
          );
        })}
      </div>
    </GameShell>
  );
}
