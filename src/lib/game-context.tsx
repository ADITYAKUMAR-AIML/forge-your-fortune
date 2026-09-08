import { createContext, useContext, type ReactNode } from "react";
import { useGame, type GameApi } from "./use-game";

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameApi {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used inside <GameProvider>");
  return context;
}
