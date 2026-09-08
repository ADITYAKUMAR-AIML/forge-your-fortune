import { assets, businesses, lifestyles, properties } from "./data";
import { recalculateNetWorth } from "./state";
import type { GameState, Transaction } from "./types";

let transactionCounter = 0;

export function recordTransaction(state: GameState, type: string, amount: number, description: string) {
  const transaction: Transaction = { id: `tx_${Date.now()}_${transactionCounter++}`, day: state.currentDay, type, amount, description, balanceAfter: Math.round(state.player.cash + state.player.bankBalance) };
  state.transactionHistory = [transaction, ...state.transactionHistory].slice(0, 100);
  return transaction;
}

export function addMoney(state: GameState, amount: number, type: string, description: string) {
  if (!Number.isFinite(amount) || amount <= 0) return false;
  state.player.cash += amount;
  recordTransaction(state, type, amount, description);
  recalculateNetWorth(state);
  return true;
}

export function removeMoney(state: GameState, amount: number, type: string, description: string) {
  if (!Number.isFinite(amount) || amount <= 0 || state.player.cash < amount) return false;
  state.player.cash -= amount;
  recordTransaction(state, type, -amount, description);
  recalculateNetWorth(state);
  return true;
}

export function depositMoney(state: GameState, amount: number) {
  if (!Number.isFinite(amount) || amount <= 0 || state.player.cash < amount) return false;
  state.player.cash -= amount;
  state.player.bankBalance += amount;
  recordTransaction(state, "deposit", -amount, "Moved cash into the bank");
  recalculateNetWorth(state);
  return true;
}

export function withdrawMoney(state: GameState, amount: number) {
  if (!Number.isFinite(amount) || amount <= 0 || state.player.bankBalance < amount) return false;
  state.player.bankBalance -= amount;
  state.player.cash += amount;
  recordTransaction(state, "withdrawal", amount, "Withdrew funds from the bank");
  recalculateNetWorth(state);
  return true;
}

export function calculateNetWorth(state: GameState) {
  return recalculateNetWorth(state);
}

export function calculateDailyExpenses(state: GameState) {
  const lifestyle = lifestyles.find((item) => item.id === state.player.lifestyle);
  const propertyCosts = state.ownedProperties.reduce((total, id) => total + (properties.find((item) => item.id === id)?.maintenanceCost ?? 0), 0);
  const assetCosts = state.ownedAssets.reduce((total, id) => total + (assets.find((item) => item.id === id)?.maintenance ?? 0), 0);
  const businessCosts = Object.entries(state.ownedBusinesses).reduce((total, [id, owned]) => {
    const business = businesses.find((item) => item.id === id);
    return total + (business ? business.operatingCost * (1 + Math.max(0, owned.level - 1) * 0.12) : 0);
  }, 0);
  return Math.round((lifestyle?.dailyMaintenance ?? 0) + propertyCosts + assetCosts + businessCosts);
}