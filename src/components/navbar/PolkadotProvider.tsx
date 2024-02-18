// src/components/navbar/PolkadotProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

interface PolkadotContextState {
  accounts: any[];
  defaultAccount: any | null;
  error: Error | null;
  loading: boolean;
  connectPolkadot: () => Promise<void>;
  disconnectPolkadot: () => void; // Ajout de la signature de disconnectPolkadot
}

const initialState: PolkadotContextState = {
  accounts: [],
  defaultAccount: null,
  error: null,
  loading: false,
  connectPolkadot: async () => {},
  disconnectPolkadot: () => {}, // Initialisation vide de disconnectPolkadot
};

const PolkadotContext = createContext<PolkadotContextState>(initialState);

export const usePolkadotConnect = (): PolkadotContextState => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error('usePolkadotConnect must be used within a PolkadotProvider');
  }
  return context;
};

export const PolkadotProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<PolkadotContextState>(initialState);

  const connectPolkadot = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const extensions = await web3Enable('my-app');
      if (extensions.length === 0) {
        throw new Error('Please install Polkadot.js extension!');
      }
      const accounts = await web3Accounts();
      setState((prevState) => ({
        ...prevState,
        accounts,
        defaultAccount: accounts[0] || null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prevState) => ({ ...prevState, error, loading: false }));
    }
  };

  // Fonction pour réinitialiser l'état
  const disconnectPolkadot = () => {
    setState({ ...initialState });
  };

  return (
    <PolkadotContext.Provider value={{ ...state, connectPolkadot, disconnectPolkadot }}>
      {children}
    </PolkadotContext.Provider>
  );
};

export default PolkadotProvider;
