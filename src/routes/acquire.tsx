import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { GameShell, PageIntro } from "@/components/game/shell";
import {
  CatalogueCard,
  EmptyNote,
  affordabilityMessage,
  notify,
  requirementLabel,
} from "@/components/game/bits";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameContext } from "@/lib/game-context";
import { characters } from "@/game/data";
import { meetsRequirement } from "@/game/state";

export const Route = createFileRoute("/acquire")({
  head: () => ({
    meta: [
      { title: "Acquire — Hooker & Millions" },
      {
        name: "description",
        content:
          "Browse the fictional 18+ collection catalogue: filter by country, category, tier, rarity and price, then acquire entries as your reputation grows.",
      },
      { property: "og:title", content: "Acquire — Hooker & Millions" },
      {
        property: "og:description",
        content: "A non-explicit fictional catalogue with tiers, rarity and unlock requirements.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/acquire" },
    ],
    links: [{ rel: "canonical", href: "/acquire" }],
  }),
  component: AcquirePage,
});

const ALL = "all";

function AcquirePage() {
  const { state, buyCharacter } = useGameContext();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [tier, setTier] = useState(ALL);
  const [rarity, setRarity] = useState(ALL);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price-asc");

  const unique = (values: string[]) => Array.from(new Set(values)).sort();
  const countries = unique(characters.map((c) => c.country));
  const categories = unique(characters.map((c) => c.category));
  const tiers = unique(characters.map((c) => String(c.tier)));
  const rarities = unique(characters.map((c) => c.rarity));

  const visible = useMemo(() => {
    const limit = Number(maxPrice);
    const list = characters.filter((character) => {
      if (search && !character.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== ALL && character.country !== country) return false;
      if (category !== ALL && character.category !== category) return false;
      if (tier !== ALL && String(character.tier) !== tier) return false;
      if (rarity !== ALL && character.rarity !== rarity) return false;
      if (maxPrice && Number.isFinite(limit) && limit > 0 && character.price > limit) return false;
      return true;
    });
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "tier-desc") return b.tier - a.tier;
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.price - b.price;
    });
    return sorted;
  }, [search, country, category, tier, rarity, maxPrice, sort]);

  const filters: Array<[string, string, string[], (value: string) => void, string]> = [
    ["Country", country, countries, setCountry, "country"],
    ["Category", category, categories, setCategory, "category"],
    ["Tier", tier, tiers, setTier, "tier"],
    ["Rarity", rarity, rarities, setRarity, "rarity"],
  ];

  return (
    <GameShell title="Acquire" subtitle="Fictional collection catalogue">
      <PageIntro text="Every entry is fictional and an adult aged 18 or older. This is a non-explicit catalogue of profiles — acquiring one raises your reputation." />

      <div className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-7">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="xl:col-span-2"
          aria-label="Search catalogue"
        />
        {filters.map(([label, value, options, setValue]) => (
          <Select key={label} value={value} onValueChange={setValue}>
            <SelectTrigger aria-label={label}>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{`All ${label.toLowerCase()}`}</SelectItem>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {label === "Tier" ? `Tier ${option}` : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        <Input
          type="number"
          min={0}
          placeholder="Max price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          aria-label="Maximum price"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="tier-desc">Highest tier</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((character) => {
            const owned = state.ownedCharacters.includes(character.id);
            const locked = !meetsRequirement(state, character.unlockRequirement);
            return (
              <CatalogueCard
                key={character.id}
                image={character.image}
                name={character.name}
                badges={[
                  character.rarity,
                  `Tier ${character.tier}`,
                  character.category,
                  character.country,
                ]}
                description={character.description}
                rows={[
                  { label: "Age", value: `${character.age} (18+)` },
                  { label: "Reputation gain", value: `+${Math.max(1, character.tier)}` },
                ]}
                price={character.price}
                owned={owned}
                locked={locked}
                requirement={requirementLabel(character.unlockRequirement)}
                actionLabel="Acquire"
                onAction={() =>
                  notify(
                    buyCharacter(character.id),
                    `${character.name} added to your collection.`,
                    affordabilityMessage(state, character.price, locked),
                  )
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyNote>No catalogue entries match those filters.</EmptyNote>
      )}
    </GameShell>
  );
}
