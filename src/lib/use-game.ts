import { useCallback, useEffect, useState } from "react";
import {
  advanceDay,
  buyStock,
  purchaseAsset,
  purchaseBusiness,
  purchaseCharacter,
  purchaseProperty,
  sellStock,
  startInvestment,
  triggerRandomEvent,
  upgradeBusiness,
} from "@/game/engine";
import { depositMoney, recordTransaction, withdrawMoney } from "@/game/economy";
import { exportSave, importSave, loadGame, resetGame, saveGame } from "@/game/save";
import { createInitialState, recalculateNetWorth, setMarketCondition } from "@/game/state";
import type { GameState, MarketCondition } from "@/game/types";

export function useGame() {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadGame());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveGame(state);
  }, [state, hydrated]);

  const mutate = useCallback((fn: (draft: GameState) => unknown) => {
    let outcome: unknown;
    setState((prev) => {
      const draft: GameState = {
        ...prev,
        player: { ...prev.player },
        ownedBusinesses: Object.fromEntries(
          Object.entries(prev.ownedBusinesses).map(([id, value]) => [id, { ...value }]),
        ),
        stockPortfolio: Object.fromEntries(
          Object.entries(prev.stockPortfolio).map(([id, value]) => [id, { ...value }]),
        ),
        marketPrices: { ...prev.marketPrices },
        ownedCharacters: [...prev.ownedCharacters],
        ownedProperties: [...prev.ownedProperties],
        ownedAssets: [...prev.ownedAssets],
        investments: prev.investments.map((i) => ({ ...i })),
        activeModifiers: prev.activeModifiers.map((m) => ({ ...m })),
        eventHistory: [...prev.eventHistory],
        transactionHistory: [...prev.transactionHistory],
      };
      outcome = fn(draft);
      return draft;
    });
    return outcome;
  }, []);

  const act = useCallback(
    (fn: (draft: GameState) => unknown) => Boolean(mutate(fn)),
    [mutate],
  );

  return {
    state,
    hydrated,
    nextDay: () => act((d) => advanceDay(d)),
    randomEvent: () => act((d) => triggerRandomEvent(d)),
    buyBusiness: (id: string) => act((d) => purchaseBusiness(d, id)),
    upgradeBusiness: (id: string) => act((d) => upgradeBusiness(d, id)),
    buyProperty: (id: string) => act((d) => purchaseProperty(d, id)),
    buyAsset: (id: string) => act((d) => purchaseAsset(d, id)),
    buyCharacter: (id: string) => act((d) => purchaseCharacter(d, id)),
    buyStock: (id: string, shares: number) => act((d) => buyStock(d, id, shares)),
    sellStock: (id: string, shares: number) => act((d) => sellStock(d, id, shares)),
    invest: (id: string, amount: number) => act((d) => startInvestment(d, id, amount)),
    deposit: (amount: number) => act((d) => depositMoney(d, amount)),
    withdraw: (amount: number) => act((d) => withdrawMoney(d, amount)),
    /** DEBUG only: force a market condition. */
    forceMarket: (condition: MarketCondition) =>
      act((d) => {
        setMarketCondition(d, condition);
        return true;
      }),
    /** DEBUG only: add or remove cash, still logged as a transaction. */
    adjustMoney: (amount: number) =>
      act((d) => {
        if (!Number.isFinite(amount) || amount === 0) return false;
        const applied = amount < 0 ? -Math.min(d.player.cash, Math.abs(amount)) : amount;
        if (applied === 0) return false;
        d.player.cash += applied;
        recordTransaction(d, "debug_adjustment", applied, "DEBUG money adjustment");
        recalculateNetWorth(d);
        return true;
      }),
    exportSave: () => {
      exportSave(state);
      return true;
    },
    importSave: async (file: File) => {
      const imported = await importSave(file);
      setState(imported);
      return true;
    },
    reset: () => {
      setState(resetGame());
      return true;
    },
  };
}

export type GameApi = ReturnType<typeof useGame>;
