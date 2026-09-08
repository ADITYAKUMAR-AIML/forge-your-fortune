import type { AssetDefinition } from "../types";

export const assets: AssetDefinition[] = [
  { id: "asset_001", name: "Velour GT", category: "Supercar", price: 90000, maintenance: 800, lifestyleBonus: 1, reputationBonus: 8, image: "/assets/assets/asset-001.webp", unlockRequirement: { netWorth: 65000 } },
  { id: "asset_002", name: "Silverline Yacht", category: "Yacht", price: 320000, maintenance: 3200, lifestyleBonus: 3, reputationBonus: 22, image: "/assets/assets/asset-002.webp", unlockRequirement: { lifestyle: "wealthy" } },
  { id: "asset_003", name: "Celestial Jet", category: "Private Jet", price: 1200000, maintenance: 12500, lifestyleBonus: 5, reputationBonus: 58, image: "/assets/assets/asset-003.webp", unlockRequirement: { lifestyle: "millionaire", reputation: 80 } },
  { id: "asset_004", name: "Signature Collection", category: "Jewelry", price: 18000, maintenance: 40, lifestyleBonus: 1, reputationBonus: 3, image: "/assets/assets/asset-004.webp", unlockRequirement: { reputation: 12 } },
];