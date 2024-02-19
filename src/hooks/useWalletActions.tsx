import { useContext, useEffect, useState } from 'react';
import { useWalletConnect } from '../components/navbar/WalletConnectProvider';
import { usePolkadotConnect } from '../components/navbar/PolkadotProvider';

export const useWalletActions = () => {
  const { address, buyNftFunction, listNFTFunction, unlistNFTFunction,signMessage } = useWalletConnect();
  const { defaultAccount } = usePolkadotConnect();
  const [walletType, setWalletType] = useState<string | null>(null);
  
  useEffect(() => {
    // Déterminez le type de wallet ici pour éviter les re-renders
    if (address) {
      setWalletType('walletConnect');
    } else if (defaultAccount) {
      setWalletType('polkadot');
    }
  }, [address, defaultAccount]); // Dépendances : Recalculez lorsque address ou defaultAccount changent

  const listNFT = (nftId, price) => {
    if (walletType === 'walletConnect') {
        console.log(nftId, price)
      listNFTFunction(nftId, price);
    } else if (walletType === 'polkadot') {
      // Votre logique pour Polkadot ici
      console.log('Polkadot list here');
    }
  };

  const unlistNFT = (nftId) => {
    if (walletType === 'walletConnect') {
      unlistNFTFunction(nftId);
    } else if (walletType === 'polkadot') {
        console.log('Polkadot unlist here');
    }
  };

  const buyNFT = (nftId, price) => {
    if (walletType === 'walletConnect') {
        console.log(nftId, price)

        buyNftFunction(nftId, price);
    } else if (walletType === 'polkadot') {
        console.log('Polkadot buy here');
    }
  };

  const signMessageVerif = () => {
    if (walletType === 'walletConnect') {
      signMessage();
    } else if (walletType === 'polkadot') {
      console.log('Polkadot sign here');
    }
  }

  return { listNFT, unlistNFT, buyNFT, setWalletType, address, defaultAccount,signMessageVerif };
};
