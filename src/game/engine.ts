import { assets, businesses, characters, events, investments, lifestyles, properties, stocks } from "./data";
import { addMoney, calculateDailyExpenses, recordTransaction, removeMoney } from "./economy";
import { recalculateNetWorth, getStockPrice, meetsRequirement, setLifestyleFromWealth } from "./state";
import type { GameState, InvestmentDefinition, MarketCondition } from "./types";

const marketBias: Record<MarketCondition, number> = { Normal: 0, Bull: 0.012, Bear: -0.012, Boom: 0.025, Crash: -0.035 };

export function purchaseCharacter(state: GameState, id: string) {
  const item = characters.find((character) => character.id === id);
  if (!item || item.age < 18 || state.ownedCharacters.includes(id) || !meetsRequirement(state, item.unlockRequirement)) return false;
  if (!removeMoney(state, item.price, "character_purchase", `Acquired ${item.name}`)) return false;
  state.ownedCharacters.push(id);
  state.player.reputation += Math.max(1, item.tier);
  return true;
}

export function purchaseBusiness(state: GameState, id: string) {
  const item = businesses.find((business) => business.id === id);
  if (!item || state.ownedBusinesses[id] || !meetsRequirement(state, item.unlockRequirement)) return false;
  if (!removeMoney(state, item.purchasePrice, "business_purchase", `Opened ${item.name}`)) return false;
  state.ownedBusinesses[id] = { level: 1 };
  state.player.reputation += 3;
  return true;
}

export function upgradeBusiness(state: GameState, id: string) {
  const item = businesses.find((business) => business.id === id);
  const owned = state.ownedBusinesses[id];
  if (!item || !owned) return false;
  const cost = Math.round(item.upgradeCost * Math.pow(1.45, owned.level - 1));
  if (!removeMoney(state, cost, "business_upgrade", `Upgraded ${item.name} to level ${owned.level + 1}`)) return false;
  owned.level += 1;
  return true;
}

function purchaseOwned(state: GameState, id: string, price: number, type: string, description: string, target: string[]) {
  if (target.includes(id) || !removeMoney(state, price, type, description)) return false;
  target.push(id);
  return true;
}

export function purchaseProperty(state: GameState, id: string) {
  const item = properties.find((property) => property.id === id);
  if (!item || !meetsRequirement(state, item.unlockRequirement)) return false;
  const success = purchaseOwned(state, id, item.price, "property_purchase", `Purchased ${item.name}`, state.ownedProperties);
  if (success) { state.player.reputation += item.reputationBonus; state.player.lifestyle = state.player.lifestyle; }
  return success;
}

export function purchaseAsset(state: GameState, id: string) {
  const item = assets.find((asset) => asset.id === id);
  if (!item || !meetsRequirement(state, item.unlockRequirement)) return false;
  const success = purchaseOwned(state, id, item.price, "asset_purchase", `Purchased ${item.name}`, state.ownedAssets);
  if (success) state.player.reputation += item.reputationBonus;
  return success;
}

export function buyStock(state: GameState, id: string, shares: number) {
  const stock = stocks.find((item) => item.id === id);
  const price = getStockPrice(state, id);
  if (!stock || !Number.isInteger(shares) || shares <= 0 || !removeMoney(state, price * shares, "stock_buy", `Bought ${shares} ${stock.symbol} shares`)) return false;
  const current = state.stockPortfolio[id] ?? { shares: 0, averagePurchasePrice: 0 };
  current.averagePurchasePrice = ((current.shares * current.averagePurchasePrice) + price * shares) / (current.shares + shares);
  current.shares += shares;
  state.stockPortfolio[id] = current;
  return true;
}

export function sellStock(state: GameState, id: string, shares: number) {
  const stock = stocks.find((item) => item.id === id);
  const current = state.stockPortfolio[id];
  if (!stock || !current || !Number.isInteger(shares) || shares <= 0 || current.shares < shares) return false;
  addMoney(state, getStockPrice(state, id) * shares, "stock_sell", `Sold ${shares} ${stock.symbol} shares`);
  current.shares -= shares;
  if (current.shares === 0) delete state.stockPortfolio[id];
  return true;
}

export function startInvestment(state: GameState, definitionId: string, principal: number) {
  const definition = investments.find((item) => item.id === definitionId);
  if (!definition || principal < definition.minimumCapital || state.investments.some((item) => item.status === "active" && item.definitionId === definitionId)) return false;
  if (!removeMoney(state, principal, "investment", `Placed ${definition.name}`)) return false;
  state.investments.push({ id: `investment_${Date.now()}`, definitionId, principal, daysRemaining: definition.duration, startedDay: state.currentDay, status: "active" });
  return true;
}

function updateStocks(state: GameState) {
  const sectorNoise: Record<string, number> = {};
  stocks.forEach((stock) => {
    const noise = (sectorNoise[stock.sector] ??= (Math.random() - 0.5) * 0.018);
    const modifier = state.activeModifiers.reduce((total, active) => total + ((active.affectedStock === stock.id || active.affectedSector === stock.sector) ? active.marketModifier ?? 0 : 0), 0);
    const movement = marketBias[state.marketCondition] * stock.marketSensitivity + noise + (Math.random() - 0.5) * stock.volatility * 2 + modifier;
    state.marketPrices[stock.id] = Math.max(1, Math.round(getStockPrice(state, stock.id) * (1 + movement) * 100) / 100);
  });
}

function triggerEvent(state: GameState, forced?: boolean) {
  const eligible = events.filter((event) => forced || Math.random() < event.probability);
  const event = eligible[Math.floor(Math.random() * eligible.length)];
  if (!event) return null;
  if (event.cashEffect && event.cashEffect > 0) addMoney(state, event.cashEffect, "random_event", event.title);
  if (event.cashEffect && event.cashEffect < 0) removeMoney(state, Math.min(state.player.cash, Math.abs(event.cashEffect)), "random_event", event.title);
  state.player.reputation += event.reputationEffect ?? 0;
  if (event.marketCondition) state.marketCondition = event.marketCondition;
  if (event.duration && (event.marketModifier || event.businessIncomeModifier || event.businessExpenseModifier)) state.activeModifiers.unshift({
    id: `${event.id}_${Date.now()}`,
    label: event.title,
    daysRemaining: event.duration,
    ...(event.marketModifier !== undefined ? { marketModifier: event.marketModifier } : {}),
    ...(event.businessIncomeModifier !== undefined ? { businessIncomeModifier: event.businessIncomeModifier } : {}),
    ...(event.businessExpenseModifier !== undefined ? { businessExpenseModifier: event.businessExpenseModifier } : {}),
    ...(event.affectedSector !== undefined ? { affectedSector: event.affectedSector } : {}),
    ...(event.affectedStock !== undefined ? { affectedStock: event.affectedStock } : {}),
  });
  state.eventHistory.unshift({ id: `${event.id}_${Date.now()}`, day: state.currentDay, title: event.title, description: event.description, category: event.category });
  state.eventHistory = state.eventHistory.slice(0, 30);
  recordTransaction(state, "random_event", event.cashEffect ?? 0, event.title);
  return event;
}

export function triggerRandomEvent(state: GameState) { return triggerEvent(state, true); }

export function advanceDay(state: GameState) {
  let income = 0;
  Object.entries(state.ownedBusinesses).forEach(([id, owned]) => {
    const business = businesses.find((item) => item.id === id);
    if (!business) return;
    const modifier = state.activeModifiers.reduce((total, active) => total + (active.businessIncomeModifier ?? 0), 0);
    const amount = Math.round((business.baseIncome + business.incomeGrowth * (owned.level - 1)) * (1 + modifier));
    if (amount > 0) { addMoney(state, amount, "business_income", `${business.name} daily income`); income += amount; }
  });
  const expenseModifier = state.activeModifiers.reduce((total, active) => total + (active.businessExpenseModifier ?? 0), 0);
  const expenses = Math.round(calculateDailyExpenses(state) * (1 + expenseModifier));
  if (expenses > 0) { removeMoney(state, Math.min(state.player.cash, expenses), "daily_expense", "Lifestyle and operating expenses"); }
  state.dailyIncome = income;
  state.dailyExpenses = expenses;
  state.investments.forEach((position) => {
    if (position.status !== "active") return;
    position.daysRemaining -= 1;
    if (position.daysRemaining <= 0) {
      const definition = investments.find((item) => item.id === position.definitionId);
      if (definition) { const returnRate = definition.expectedReturn + (Math.random() - 0.5) * definition.risk * 2; const payout = Math.max(0, Math.round(position.principal * (1 + returnRate))); addMoney(state, payout, "investment_return", `${definition.name} matured`); }
      position.status = "matured";
    }
  });
  updateStocks(state);
  triggerEvent(state);
  state.activeModifiers = state.activeModifiers.map((item) => ({ ...item, daysRemaining: item.daysRemaining - 1 })).filter((item) => item.daysRemaining > 0);
  state.currentDay += 1;
  recalculateNetWorth(state);
  setLifestyleFromWealth(state);
  return state;
}

export function forceMarket(state: GameState, condition: MarketCondition) { state.marketCondition = condition; }