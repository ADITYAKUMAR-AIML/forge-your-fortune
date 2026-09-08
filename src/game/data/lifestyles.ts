import type { LifestyleDefinition } from "../types";

export const lifestyles: LifestyleDefinition[] = [
  { id: "low", label: "Low", minimumNetWorth: 0, dailyMaintenance: 80, reputationBonus: 0, availableCharacters: 1, availableProperties: ["prop_001"], availableLocations: ["city"], availableEvents: ["all"] },
  { id: "comfortable", label: "Comfortable", minimumNetWorth: 25000, dailyMaintenance: 180, reputationBonus: 2, availableCharacters: 2, availableProperties: ["prop_001", "prop_002"], availableLocations: ["city", "coast"], availableEvents: ["all"] },
  { id: "wealthy", label: "Wealthy", minimumNetWorth: 150000, dailyMaintenance: 550, reputationBonus: 7, availableCharacters: 3, availableProperties: ["prop_001", "prop_002", "prop_003"], availableLocations: ["city", "coast", "hills"], availableEvents: ["all"] },
  { id: "millionaire", label: "Millionaire", minimumNetWorth: 1000000, dailyMaintenance: 2400, reputationBonus: 18, availableCharacters: 4, availableProperties: ["prop_001", "prop_002", "prop_003", "prop_004"], availableLocations: ["city", "coast", "hills", "private"], availableEvents: ["all"] },
  { id: "elite", label: "Elite", minimumNetWorth: 5000000, dailyMaintenance: 10000, reputationBonus: 40, availableCharacters: 4, availableProperties: ["prop_001", "prop_002", "prop_003", "prop_004"], availableLocations: ["city", "coast", "hills", "private"], availableEvents: ["all"] },
];