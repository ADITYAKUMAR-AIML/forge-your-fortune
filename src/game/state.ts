import { assets, businesses, characters, properties, stocks } from "./data";
import type { GameState, LifestyleId, MarketCondition } from "./types";

export const SAVE_KEY = "hooker-and-millions-save-v1";

export const createInitialState = (): GameState => ({
  player: { cash: 10000, bankBalance: 0, reputation: 0, lifestyle: "low" },
  netWorth: 10000,
  currentDay: 1,
  marketCondition: "Normal",
  ownedCharacters: [],
  ownedBusinesses: {},
  ownedProperties: [],
  ownedAssets: [],
  stockPortfolio: {},
  marketPrices: Object.fromEntries(stocks.map((stock) => [stock.id, stock.price])),
  investments: [],
  activeModifiers: [],
  eventHistory: [],
  transactionHistory: [],
  dailyIncome: 0,
  dailyExpenses: 0,
});

const lifestyleRank: Record<LifestyleId, number> = { low: 0, comfortable: 1, wealthy: 2, millionaire: 3, elite: 4 };

export function meetsRequirement(state: GameState, requirement?: { reputation?: number; netWorth?: number; lifestyle?: LifestyleId; day?: number }) {
  if (!requirement) return true;
  return (
    (requirement.reputation === undefined || state.player.reputation >= requirement.reputation) &&
    (requirement.netWorth === undefined || state.netWorth >= requirement.netWorth) &&
    (requirement.lifestyle === undefined || lifestyleRank[state.player.lifestyle] >= lifestyleRank[requirement.lifestyle]) &&
    (requirement.day === undefined || state.currentDay >= requirement.day)
  );
}

export function getOwnedCatalogValue(state: GameState) {
  const businessesValue = Object.entries(state.ownedBusinesses).reduce((total, [id, owned]) => {
    const definition = businesses.find((item) => item.id === id);
    return total + (definition ? definition.purchasePrice + Math.max(0, owned.level - 1) * definition.upgradeCost : 0);
  }, 0);
  const propertyValue = state.ownedProperties.reduce((total, id) => total + (properties.find((item) => item.id === id)?.price ?? 0), 0);
  const assetValue = state.ownedAssets.reduce((total, id) => total + (assets.find((item) => item.id === id)?.price ?? 0), 0);
  const characterValue = state.ownedCharacters.reduce((total, id) => total + (characters.find((item) => item.id === id)?.price ?? 0), 0);
  const stockValue = Object.entries(state.stockPortfolio).reduce((total, [id, position]) => total + position.shares * (state.marketPrices[id] ?? 0), 0);
  const investmentValue = state.investments.reduce((total, investment) => total + investment.principal, 0);
  return businessesValue + propertyValue + assetValue + characterValue + stockValue + investmentValue;
}

export function recalculateNetWorth(state: GameState) {
  state.netWorth = Math.max(0, Math.round(state.player.cash + state.player.bankBalance + getOwnedCatalogValue(state)));
  return state.netWorth;
}

export function setLifestyleFromWealth(state: GameState) {
  const thresholds: Array<[LifestyleId, number]> = [["elite", 5_000_000], ["millionaire", 1_000_000], ["wealthy", 150_000], ["comfortable", 25_000], ["low", 0]];
  const next = thresholds.find(([, minimum]) => state.netWorth >= minimum)?.[0] ?? "low";
  const current = lifestyleRank[state.player.lifestyle];
  if (lifestyleRank[next] < current) state.player.lifestyle = next;
  else if (lifestyleRank[next] > current && state.player.reputation >= lifestyleRank[next] * 8) state.player.lifestyle = next;
}

export function normalizeState(input: unknown): GameState {
  const fresh = createInitialState();
  if (!input || typeof input !== "object") return fresh;
  const candidate = input as Partial<GameState>;
  const merged: GameState = {
    ...fresh,
    ...candidate,
    player: { ...fresh.player, ...(candidate.player ?? {}) },
    ownedBusinesses: candidate.ownedBusinesses ?? {},
    stockPortfolio: candidate.stockPortfolio ?? {},
    marketPrices: { ...fresh.marketPrices, ...(candidate.marketPrices ?? {}) },
    ownedCharacters: candidate.ownedCharacters ?? [],
    ownedProperties: candidate.ownedProperties ?? [],
    ownedAssets: candidate.ownedAssets ?? [],
    investments: candidate.investments ?? [],
    activeModifiers: candidate.activeModifiers ?? [],
    eventHistory: candidate.eventHistory ?? [],
    transactionHistory: candidate.transactionHistory ?? [],
  };
  recalculateNetWorth(merged);
  return merged;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function getStockPrice(state: GameState, id: string) {
  return state.marketPrices[id] ?? stocks.find((stock) => stock.id === id)?.price ?? 0;
}

export function setMarketCondition(state: GameState, condition: MarketCondition) {
  state.marketCondition = condition;
}