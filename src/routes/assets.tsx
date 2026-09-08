import { createFileRoute } from "@tanstack/react-router";
import { GameShell, PageIntro } from "@/components/game/shell";
import { CatalogueCard, affordabilityMessage, notify, requirementLabel } from "@/components/game/bits";
import { useGameContext } from "@/lib/game-context";
import { assets } from "@/game/data";
import { formatMoney, meetsRequirement } from "@/game/state";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Hooker & Millions" },
      {
        name: "description",
        content:
          "Collect fictional supercars, yachts, jets and jewellery that lift lifestyle and reputation at the cost of daily upkeep.",
      },
      { property: "og:title", content: "Assets — Hooker & Millions" },
      {
        property: "og:description",
        content: "Trophy purchases with upkeep, bonuses and unlock requirements.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/assets" },
    ],
    links: [{ rel: "canonical", href: "/assets" }],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const { state, buyAsset } = useGameContext();

  return (
    <GameShell title="Assets" subtitle="Trophies with upkeep">
      <PageIntro text="Assets are pure prestige: they add reputation and lifestyle weight but charge upkeep every day you own them." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {assets.map((asset) => {
          const owned = state.ownedAssets.includes(asset.id);
          const locked = !meetsRequirement(state, asset.unlockRequirement);
          return (
            <CatalogueCard
              key={asset.id}
              image={asset.image}
              name={asset.name}
              badges={[asset.category]}
              rows={[
                { label: "Daily upkeep", value: formatMoney(asset.maintenance) },
                { label: "Lifestyle bonus", value: `+${asset.lifestyleBonus}` },
                { label: "Reputation bonus", value: `+${asset.reputationBonus}` },
              ]}
              price={asset.price}
              owned={owned}
              locked={locked}
              requirement={requirementLabel(asset.unlockRequirement)}
              actionLabel="Purchase"
              onAction={() =>
                notify(
                  buyAsset(asset.id),
                  `${asset.name} purchased.`,
                  affordabilityMessage(state, asset.price, locked),
                )
              }
            />
          );
        })}
      </div>
    </GameShell>
  );
}
