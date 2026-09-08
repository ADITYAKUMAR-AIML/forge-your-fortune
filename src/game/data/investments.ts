import type { InvestmentDefinition } from "../types";

export const investments: InvestmentDefinition[] = [
  { id: "inv_001", name: "Treasury Ladder", type: "Safe", minimumCapital: 1000, expectedReturn: 0.012, risk: 0.01, duration: 3, liquidity: "Liquid", description: "Small, reliable returns with modest opportunity cost." },
  { id: "inv_002", name: "Growth Syndicate", type: "Medium Risk", minimumCapital: 8000, expectedReturn: 0.065, risk: 0.09, duration: 5, liquidity: "Limited", description: "A diversified fictional growth pool with variable outcomes." },
  { id: "inv_003", name: "Frontier Capital", type: "High Risk", minimumCapital: 25000, expectedReturn: 0.16, risk: 0.24, duration: 7, liquidity: "Limited", description: "High upside, high uncertainty, and no guaranteed return." },
  { id: "inv_004", name: "Metro Land Trust", type: "Real Estate", minimumCapital: 15000, expectedReturn: 0.085, risk: 0.12, duration: 6, liquidity: "Limited", description: "A fictional property-backed investment with slower growth." },
  { id: "inv_005", name: "Black Label Lock-In", type: "Locked-Term", minimumCapital: 50000, expectedReturn: 0.28, risk: 0.3, duration: 10, liquidity: "Locked", description: "Capital is unavailable until the term matures." },
];