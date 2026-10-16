import { create } from "zustand";

interface BalanceState {
  balance: number;
  setBalance: (balance: number) => void;
  addBalance: (amount: number) => void;
}

export const useBalance = create<BalanceState>()((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  addBalance: (amount) =>
    set((state) => ({ balance: state.balance + amount })),
}));