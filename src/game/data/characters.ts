import type { CharacterDefinition } from "../types";

export const characters: CharacterDefinition[] = [
  { id: "char_001", name: "Maya Vale", age: 24, country: "United States", category: "Premium", tier: 2, rarity: "Uncommon", price: 5000, image: "/assets/characters/character-001.webp", description: "A fictional adult catalogue entry with a polished public profile.", unlockRequirement: { reputation: 5 } },
  { id: "char_002", name: "Elena Marlowe", age: 29, country: "United Kingdom", category: "Executive", tier: 3, rarity: "Rare", price: 18000, image: "/assets/characters/character-002.webp", description: "A fictional adult with an exclusive, high-tier catalogue profile.", unlockRequirement: { reputation: 22, netWorth: 45000 } },
  { id: "char_003", name: "Sofia Laurent", age: 31, country: "France", category: "Icon", tier: 4, rarity: "Iconic", price: 65000, image: "/assets/characters/character-003.webp", description: "A fictional adult reserved for the upper levels of the collection.", unlockRequirement: { reputation: 55, lifestyle: "millionaire" } },
  { id: "char_004", name: "Nia Brooks", age: 22, country: "Canada", category: "Rising", tier: 1, rarity: "Common", price: 2400, image: "/assets/characters/character-004.webp", description: "A fictional adult catalogue entry for early progression.", unlockRequirement: { day: 2 } },
];