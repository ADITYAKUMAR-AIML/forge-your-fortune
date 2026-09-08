export type LifestyleId = "low" | "comfortable" | "wealthy" | "millionaire" | "elite";
export type MarketCondition = "Normal" | "Bull" | "Bear" | "Boom" | "Crash";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Iconic";

export interface UnlockRequirement {
  reputation?: number;
  netWorth?: number;
  lifestyle?: LifestyleId;
  day?: number;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  age: number;
  country: string;
  category: string;
  tier: number;
  rarity: Rarity;
  price: number;
  image: string;
  description: string;
  unlockRequirement?: UnlockRequirement;
  optionalVideo?: string;
}

export interface BusinessDefinition {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  baseIncome: number;
  operatingCost: number;
  upgradeCost: number;
  incomeGrowth: number;
  image: string;
  unlockRequirement?: UnlockRequirement;
}

export interface StockDefinition {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  price: number;
  volatility: number;
  risk: "Low" | "Medium" | "High";
  marketSensitivity: number;
}

export interface InvestmentDefinition {
  id: string;
  name: string;
  type: "Safe" | "Medium Risk" | "High Risk" | "Real Estate" | "Locked-Term";
  minimumCapital: number;
  expectedReturn: number;
  risk: number;
  duration: number;
  liquidity: "Liquid" | "Limited" | "Locked";
  description: string;
}

export interface PropertyDefinition {
  id: string;
  name: string;
  category: string;
  price: number;
  maintenanceCost: number;
  lifestyleBonus: number;
  reputationBonus: number;
  image: string;
  unlockRequirement?: UnlockRequirement;
}

export interface AssetDefinition {
  id: string;
  name: string;
  category: string;
  price: number;
  maintenance: number;
  lifestyleBonus: number;
  reputationBonus: number;
  image: string;
  unlockRequirement?: UnlockRequirement;
}

export interface LifestyleDefinition {
  id: LifestyleId;
  label: string;
  minimumNetWorth: number;
  dailyMaintenance: number;
  reputationBonus: number;
  availableCharacters: number;
  availableProperties: string[];
  availableLocations: string[];
  availableEvents: string[];
}

export interface EventDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  probability: number;
  duration?: number;
  marketCondition?: MarketCondition;
  cashEffect?: number;
  reputationEffect?: number;
  affectedSector?: string;
  affectedStock?: string;
  marketModifier?: number;
  businessIncomeModifier?: number;
  businessExpenseModifier?: number;
}

export interface Transaction {
  id: string;
  day: number;
  type: string;
  amount: number;
  description: string;
  balanceAfter: number;
}

export interface EventLog {
  id: string;
  day: number;
  title: string;
  description: string;
  category: string;
}

export interface StockPosition {
  shares: number;
  averagePurchasePrice: number;
}

export interface InvestmentPosition {
  id: string;
  definitionId: string;
  principal: number;
  daysRemaining: number;
  startedDay: number;
  status: "active" | "matured";
}

export interface ActiveModifier {
  id: string;
  label: string;
  daysRemaining: number;
  marketModifier?: number;
  businessIncomeModifier?: number;
  businessExpenseModifier?: number;
  affectedSector?: string;
  affectedStock?: string;
}

export interface GameState {
  player: {
    cash: number;
    bankBalance: number;
    reputation: number;
    lifestyle: LifestyleId;
  };
  netWorth: number;
  currentDay: number;
  marketCondition: MarketCondition;
  ownedCharacters: string[];
  ownedBusinesses: Record<string, { level: number }>;
  ownedProperties: string[];
  ownedAssets: string[];
  stockPortfolio: Record<string, StockPosition>;
  marketPrices: Record<string, number>;
  investments: InvestmentPosition[];
  activeModifiers: ActiveModifier[];
  eventHistory: EventLog[];
  transactionHistory: Transaction[];
  dailyIncome: number;
  dailyExpenses: number;
  lastSavedAt?: string;
}