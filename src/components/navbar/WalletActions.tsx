import React from 'react';
import { useWalletConnect } from './WalletConnectProvider'


const WalletActions: React.FC = () => {
  const { connect } = useWalletConnect();

  return (
    <div>
      <button onClick={connect}>Connect Wallet</button>
    </div>
  );
};

export default WalletActions;
