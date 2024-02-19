import { useCallback, useState, useEffect, ReactNode, useContext, createContext } from "react";
import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import QRCodeModal from "@walletconnect/legacy-modal";
import { ERROR } from "@walletconnect/utils";
import { isMobile } from '@walletconnect/legacy-utils'

import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { buyNftTx, initializeApi, listNftTx, unlistNftTx } from "ternoa-js";

const DEFAULT_APP_METADATA = {
  name: "CapsHub",
  description: "CapsHub",
  url: "https://ternoa.com",
  icons: ["https://www.ternoa.com/favicon.ico"],
};

const TERNOA_ALPHANET_CHAIN = "ternoa:18bcdb75a0bba577b084878db2dc2546";



const requiredNamespaces = {
  ternoa: {
    chains: [TERNOA_ALPHANET_CHAIN],
    events: ["event_test"],
    methods: ["sign_message"],
  },
};


interface WalletConnectContextType {
  connect: (pairing?: any) => Promise<SessionTypes.Struct | null>;
  buyNftFunction: (nftId: string, nftPrice: string) => Promise<void>;
  address: string | undefined;
  listNFTFunction: (nftId: string, nftPrice: number) => Promise<void>;
  unlistNFTFunction: (nftId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: () => Promise<void>;
}

// Création du contexte avec un type spécifié
const WalletConnectContext = createContext<WalletConnectContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useWalletConnect = (): WalletConnectContextType => {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within a WalletConnectProvider');
  }
  return context;
};

// Composant fournisseur
interface WalletConnectProviderProps {
  children: ReactNode;
}




export const WalletConnectProvider: React.FunctionComponent<WalletConnectProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client>();
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [session, setSession] = useState<SessionTypes.Struct>();
  const [address, setAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isAccountCertified, setIsAccountCertified] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const onSessionConnected = useCallback((_session: SessionTypes.Struct) => {
    const _pubKey = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat()[0]
      .split(":")[2];
    setSession(_session);
    setAddress(_pubKey);
  }, []);

  const subscribeToEvents = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      _client.on("session_update", ({ topic, params }) => {
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        onSessionConnected(updatedSession);
      });
      _client.on("session_delete", () => {
        reset();
      });
    },
    [onSessionConnected]
  );

  const checkPersistedState = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      // populates existing pairings to state
      setPairings(_client.pairing.values);

      if (typeof session !== "undefined") return;

      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(
          _client.session.keys[lastKeyIndex]
        );
        await onSessionConnected(_session);
        console.log("session", _session);
        return _session;
      }
    },
    [session, onSessionConnected]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);
      const _client = await Client.init({
        relayUrl: "wss://wallet-connectrelay.ternoa.network/",
        projectId: process.env.WalletConnectID,
        metadata: DEFAULT_APP_METADATA,
      });
      await subscribeToEvents(_client);
      await checkPersistedState(_client);
      setClient(_client);
      console.log("client", _client);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [checkPersistedState, subscribeToEvents]);

  const connect = useCallback(
    async (pairing: any) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      try {
        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces: requiredNamespaces,
        });
        setIsError(false);

        if (uri) {
          if (!isMobile()) {
            QRCodeModal.open(uri, () => { });
          } else {
            window.location.replace(`ternoa-wallet://wc?uri=${uri}`);
          }
        }
        const session = await approval();
        onSessionConnected(session);

        return session;
      } catch (e) {
        console.error(e);
        return null;
        // ignore rejection
      } finally {
        QRCodeModal.close();
      }
    },
    [client, onSessionConnected]
  );

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }
    await client.disconnect({
      topic: session.topic,
      reason: ERROR.USER_DISCONNECTED.format(),
    });

    reset();
  }, [client, session]);

  const reset = () => {
    setPairings([]);
    setSession(undefined);
    setAddress(undefined);
  };


  const signMessage = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof address === "undefined") {
      throw new Error("Not connected");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    setIsLoading(true);
    setIsError(false);

    setMessage(message)
    try {
      const response = await client.request<string>({
        chainId: TERNOA_ALPHANET_CHAIN,
        topic: session.topic,
        request: {
          method: "sign_message",
          params: {
            pubKey: address,
            request: {
              message,
            },
          },
        },
      });
      const responseObj = JSON.parse(response);
      await cryptoWaitReady();
      const isValid = isValidSignaturePolkadot(
        "message",
        responseObj.signedMessageHash,
        address
      );
      setIsAccountCertified(isValid);
    } catch {
      setIsError(true);
      console.log("ERROR: invalid signature");

    } finally {
      setIsLoading(false);
    }
  }, [client, session, address]);

  const isValidSignaturePolkadot = (
    signedMessage: string,
    signature: string,
    address: string
  ) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  };

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [client, createClient]);


  const buyNftFunction = useCallback(async (nftId, nftPrice) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof address === "undefined") {
      throw new Error("Not connected");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await buyNftTx(nftId, nftPrice);
    setIsLoading(true)
    try {
      const response = await client.request<string>({
        chainId: TERNOA_ALPHANET_CHAIN,
        topic: session.topic,
        request: {
          method: 'sign_message',
          params: {
            pubKey: address,
            request: {
              hash: tx,
              nonce: -1,
              submit: true,
            },
          },
        },
      });
      const txHash = JSON.parse(response);
      if (txHash) {
        console.log('OK')
      }
      setIsLoading(false)
    } catch {
      setIsError(true);
      console.log("ERROR: invalid signature");

    } finally {
      setIsLoading(false);
    }
  }, [client, session, address]);


  const listNFTFunction = useCallback(async (nftId, nftPrice) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof address === "undefined") {
      throw new Error("Not connected");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await listNftTx(nftId, 386, nftPrice);
    setIsLoading(true)
    try {
      const response = await client.request<string>({
        chainId: TERNOA_ALPHANET_CHAIN,
        topic: session.topic,
        request: {
          method: 'sign_message',
          params: {
            pubKey: address,
            request: {
              hash: tx,
              nonce: -1,
              submit: true,
            },
          },
        },
      });
      const txHash = JSON.parse(response);
      if (txHash) {
        console.log('OK')
      }
      setIsLoading(false)
    } catch {
      setIsError(true);
      console.log("ERROR: invalid signature");

    } finally {
      setIsLoading(false);
    }
  }, [client, session, address]);


  const unlistNFTFunction = useCallback(async (nftId) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof address === "undefined") {
      throw new Error("Not connected");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await unlistNftTx(nftId)
    setIsLoading(true)
    try {
      const response = await client.request<string>({
        chainId: TERNOA_ALPHANET_CHAIN,
        topic: session.topic,
        request: {
          method: 'sign_message',
          params: {
            pubKey: address,
            request: {
              hash: tx,
              nonce: -1,
              submit: true,
            },
          },
        },
      });
      const txHash = JSON.parse(response);
      if (txHash) {
        console.log('OK')
      }
      setIsLoading(false)
    } catch {
      setIsError(true);
      console.log("ERROR: invalid signature");

    } finally {
      setIsLoading(false);
    }
  }, [client, session, address]);

  
  return (
    <WalletConnectContext.Provider value={{ connect,buyNftFunction,listNFTFunction,unlistNFTFunction,address,disconnect,signMessage }}>
      {children}
    </WalletConnectContext.Provider>
  );
}