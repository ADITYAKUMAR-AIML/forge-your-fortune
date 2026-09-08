import type { EventDefinition } from "../types";

export const events: EventDefinition[] = [
  { id: "event_001", title: "Technology Surge", category: "Market", description: "A wave of demand lifts technology sentiment for a few days.", probability: 0.18, duration: 3, affectedSector: "Technology", marketModifier: 0.018 },
  { id: "event_002", title: "Consumer Spending Drop", category: "Business", description: "Retail traffic slows and operating costs feel heavier.", probability: 0.16, duration: 2, affectedSector: "Retail", businessIncomeModifier: -0.12, businessExpenseModifier: 0.08 },
  { id: "event_003", title: "Banking Crisis", category: "Market", description: "Confidence evaporates across financial markets.", probability: 0.08, duration: 3, affectedSector: "Finance", marketModifier: -0.028, reputationEffect: -2 },
  { id: "event_004", title: "Real Estate Surge", category: "Market", description: "Property demand drives a fictional real-estate rally.", probability: 0.12, duration: 4, affectedSector: "Real Estate", marketModifier: 0.022, reputationEffect: 1 },
  { id: "event_005", title: "Company Breakthrough", category: "Company", description: "A breakthrough sends one entertainment name into the spotlight.", probability: 0.1, duration: 2, affectedStock: "stk_006", marketModifier: 0.04, reputationEffect: 1 },
  { id: "event_006", title: "Unexpected Repair Bill", category: "Expense", description: "A property or asset needs immediate attention.", probability: 0.14, cashEffect: -1800, reputationEffect: -1 },
];