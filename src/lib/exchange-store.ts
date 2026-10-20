import { create } from 'zustand';

interface ExchangeState {
  sendAmount: string;
  sendCurrency: string;
  receiveCurrency: string;
  activeAsset: 'gold' | 'silver'; // Which card is the input?
  
  setSendAmount: (amount: string) => void;
  setSendCurrency: (currency: string) => void;
  setReceiveCurrency: (currency: string) => void;
  setActiveAsset: (asset: 'gold' | 'silver') => void;
  swap: () => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  sendAmount: '1',
  sendCurrency: 'GHD',
  receiveCurrency: 'ZAR',
  activeAsset: 'gold',

  setSendAmount: (amount) => set({ sendAmount: amount }),
  setSendCurrency: (currency) => set({ sendCurrency: currency }),
  setReceiveCurrency: (currency) => set({ receiveCurrency: currency }),
  setActiveAsset: (asset) => set({ activeAsset: asset }),
  
  // Flip the currencies
  swap: () => set((state) => ({
    sendCurrency: state.receiveCurrency,
    receiveCurrency: state.sendCurrency,
  })),
}));