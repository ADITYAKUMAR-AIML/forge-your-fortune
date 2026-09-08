import type { StockDefinition } from "../types";

export const stocks: StockDefinition[] = [
  { id: "stk_001", symbol: "LUXR", companyName: "Luxora Systems", sector: "Technology", price: 74, volatility: 0.018, risk: "Medium", marketSensitivity: 1.1 },
  { id: "stk_002", symbol: "CROWN", companyName: "Crownline Finance", sector: "Finance", price: 42, volatility: 0.011, risk: "Low", marketSensitivity: 0.85 },
  { id: "stk_003", symbol: "VOLT", companyName: "Volt Meridian", sector: "Energy", price: 118, volatility: 0.032, risk: "High", marketSensitivity: 1.35 },
  { id: "stk_004", symbol: "HABIT", companyName: "Habitat Union", sector: "Real Estate", price: 61, volatility: 0.015, risk: "Medium", marketSensitivity: 0.95 },
  { id: "stk_005", symbol: "MUSE", companyName: "Muse Retail Group", sector: "Retail", price: 29, volatility: 0.024, risk: "High", marketSensitivity: 1.2 },
  { id: "stk_006", symbol: "NOIR", companyName: "Noir Entertainment", sector: "Entertainment", price: 88, volatility: 0.028, risk: "High", marketSensitivity: 1.25 },
];