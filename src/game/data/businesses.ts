import type { BusinessDefinition } from "../types";

export const businesses: BusinessDefinition[] = [
  { id: "biz_001", name: "Velvet Room", category: "Nightlife", purchasePrice: 12000, baseIncome: 900, operatingCost: 260, upgradeCost: 6500, incomeGrowth: 420, image: "/assets/businesses/business-001.webp", unlockRequirement: { reputation: 4 } },
  { id: "biz_002", name: "Afterglow Suites", category: "Hospitality", purchasePrice: 42000, baseIncome: 3100, operatingCost: 1050, upgradeCost: 19000, incomeGrowth: 1500, image: "/assets/businesses/business-002.webp", unlockRequirement: { reputation: 18, netWorth: 35000 } },
  { id: "biz_003", name: "Apex Digital", category: "Technology", purchasePrice: 95000, baseIncome: 7800, operatingCost: 3200, upgradeCost: 47000, incomeGrowth: 4200, image: "/assets/businesses/business-003.webp", unlockRequirement: { reputation: 45, lifestyle: "wealthy" } },
];