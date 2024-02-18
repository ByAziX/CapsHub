import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// Définition des types pour l'état et les fonctions du contexte
interface PolkadotContextState {
  accounts: InjectedAccountWithMeta[];
  defaultAccount: InjectedAccountWithMeta | null;
  error: Error | null;
  loading: boolean;
  connectPolkadot: () => Promise<void>;
  disconnectPolkadot: () => void;
}

// Valeurs initiales du contexte
const initialState: PolkadotContextState = {
  accounts: [],
  defaultAccount: null,
  error: null,
  loading: false,
  connectPolkadot: async () => {},
  disconnectPolkadot: () => {},

};

const PolkadotContext = createContext<PolkadotContextState>(initialState);

// Provider du contexte
export const PolkadotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);

  const connectPolkadot = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const extensions = await web3Enable('my-dapp');
      if (extensions.length === 0) {
        throw new Error('Please install Polkadot.js extension!');
      }
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found in Polkadot.js extension!');
      }
      setState({ ...state, accounts, defaultAccount: accounts[0], loading: false, error: null });
    } catch (error) {
      setState({ ...state, error, loading: false });
    }
  }, []);

  const disconnectPolkadot = useCallback(() => {
    setState({ ...initialState });
  }, []);

  return (
    <PolkadotContext.Provider value={{ ...state, connectPolkadot, disconnectPolkadot }}>
      {children}
    </PolkadotContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const usePolkadot = () => useContext(PolkadotContext);
