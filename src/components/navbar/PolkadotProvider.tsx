// src/components/navbar/PolkadotProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PolkadotContextState {
  accounts: any[];
  defaultAccount: any | null;
  error: Error | null;
  loading: boolean;
  connectPolkadot: () => Promise<void>;
  disconnectPolkadot: () => void; 
}

const initialState: PolkadotContextState = {
  accounts: [],
  defaultAccount: null,
  error: null,
  loading: false,
  connectPolkadot: async () => {},
  disconnectPolkadot: () => {}, 
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

  // Déclarez connectPolkadot ici pour le rendre accessible dans le contexte
  const connectPolkadot = async () => {
    if (typeof window !== 'undefined') { // Assurez-vous que le code s'exécute côté client
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
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
    }
  };

  const disconnectPolkadot = () => {
    setState({ ...initialState });
  };
  

  useEffect(() => {
    connectPolkadot();
  }, []);

  return (
    <PolkadotContext.Provider value={{ ...state, connectPolkadot, disconnectPolkadot }}>
      {children}
    </PolkadotContext.Provider>
  );
};

export default PolkadotProvider;