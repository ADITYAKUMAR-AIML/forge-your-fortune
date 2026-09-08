import type { PropertyDefinition } from "../types";

export const properties: PropertyDefinition[] = [
  { id: "prop_001", name: "City Apartment", category: "Apartment", price: 28000, maintenanceCost: 180, lifestyleBonus: 1, reputationBonus: 4, image: "/assets/properties/property-001.webp", unlockRequirement: { netWorth: 18000 } },
  { id: "prop_002", name: "Luxury Apartment", category: "Apartment", price: 85000, maintenanceCost: 620, lifestyleBonus: 2, reputationBonus: 10, image: "/assets/properties/property-002.webp", unlockRequirement: { netWorth: 70000, reputation: 20 } },
  { id: "prop_003", name: "Hillside House", category: "House", price: 185000, maintenanceCost: 1400, lifestyleBonus: 3, reputationBonus: 18, image: "/assets/properties/property-003.webp", unlockRequirement: { lifestyle: "wealthy" } },
  { id: "prop_004", name: "The Crown Penthouse", category: "Penthouse", price: 750000, maintenanceCost: 6500, lifestyleBonus: 5, reputationBonus: 40, image: "/assets/properties/property-004.webp", unlockRequirement: { lifestyle: "millionaire", reputation: 70 } },
];