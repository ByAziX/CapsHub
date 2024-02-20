import {
  createContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useContext,
} from "react";
import SignClient from "@walletconnect/sign-client";
import { isMobile as checkIsMobile } from "@walletconnect/legacy-utils";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { WalletConnectModal } from '@walletconnect/modal'

import { buyNftTx, initializeApi, listNftTx, unlistNftTx } from "ternoa-js";
import { Core } from '@walletconnect/core'
import QRCodeModal from "@walletconnect/qrcode-modal";


const DEFAULT_APP_METADATA = {
  name: "CapsHUB",
  description: "Caps HUB dApp",
  url: "https://hub.ternoa.network/",
  icons: ["https://www.ternoa.com/favicon.ico"],
};

interface WalletConnectContextType {
  pairings: PairingTypes.Struct[];
  isInitializing: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isConnected: boolean;
  account?: string;
  client?: SignClient;
  session?: SessionTypes.Struct;
  connect: (pairing: any) => Promise<SessionTypes.Struct | null>;
  disconnect: () => Promise<void>;
  request: (hashTX: string) => Promise<any>;
  isCreatingUri: boolean;
  listNFTFunction: (nftId: string, nftPrice: number) => Promise<void>;
  unlistNFTFunction: (nftId: string) => Promise<void>;
  buyNftFunction: (nftId: string, nftPrice: number) => Promise<void>;
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

const walletConnectModal = new WalletConnectModal({
  projectId: '85f16beb581a579b42b07358e7d51f77'
})

// Composant fournisseur
interface WalletConnectProviderProps {
  children: ReactNode;
}

const core = new Core({
  projectId: '85f16beb581a579b42b07358e7d51f77'
})


export const WalletConnectProvider: React.FunctionComponent<WalletConnectProviderProps> = ({ children }) => {
  const initialized = useRef<boolean>();
  const [client, setClient] = useState<SignClient>();
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [session, setSession] = useState<SessionTypes.Struct>();
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [isCreatingUri, setIsCreatingUri] = useState<boolean>(false);
  const [account, setAccount] = useState<string>();
  const [walletConnectModalUri, setWalletConnectModalUri] =
    useState<string | undefined>(undefined);
  const isMobile = checkIsMobile();
  

  const isConnected = !!session;

  const reset = () => {
    setPairings([]);
    setSession(undefined);
    setAccount(undefined);
  };

  const onSessionConnected = useCallback((_session: SessionTypes.Struct) => {
    const account = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat()[0]
      .split(":")[2];
    setSession(_session);
    setAccount(account);
    console.log("connected", _session, account);
  }, []);

  const connect = useCallback(
    async (pairing: any) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      try {
        setIsCreatingUri(true);
        const requiredNamespaces = {
          ternoa: {
            chains: ["ternoa:18bcdb75a0bba577b084878db2dc2546"],
            events: ["polkadot_event_test"],
            methods: ["sign_message"],
          },
        };
        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces: requiredNamespaces,
        });
        setIsCreatingUri(false);
        if (uri) {
          if (!isMobile) {
            console.log("URI:", uri);
            QRCodeModal.open(uri, () => {});
            setIsConnecting(true);
          } else {
            window.location.replace(`ternoa-wallet://wc?uri=${uri}`);
          }
        }
        const session = await approval();
        console.log("Established session:", session);
        onSessionConnected(session);
        return session;
      } catch (e) {
        console.error(e);
        return null;
        // ignore rejection
      } finally {
        setIsConnecting(false);
        setIsCreatingUri(false);
        QRCodeModal.close();

        if (!isMobile) {
          setWalletConnectModalUri(undefined);
        }
      }
    },
    [client, onSessionConnected, isMobile]
  );

  const disconnect = useCallback(async () => {
    console.log("disconnect", session);
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }
    try {
      setIsDisconnecting(true);
      await client.disconnect({
        topic: session.topic,
        reason: undefined
      });
      // Reset app state after disconnect.
      reset();
    } finally {
      setIsDisconnecting(false);
    }
  }, [client, session]);

  const subscribeToEvents = useCallback(
    async (_client: SignClient) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      _client.on("session_update", ({ topic, params }) => {
        console.log("EVENT", "session_update", { topic, params });
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        onSessionConnected(updatedSession);
      });
      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete");
        reset();
      });
    },
    [onSessionConnected]
  );

  const checkPersistedState = useCallback(
    async (_client: SignClient) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      // populates existing pairings to state
      setPairings(_client.pairing.values);
      console.log("RESTORED PAIRINGS: ", _client.pairing.values);
      if (typeof session !== "undefined") return;
      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(
          _client.session.keys[lastKeyIndex]
        );
        console.log("RESTORED SESSION:", _session);
        await onSessionConnected(_session);
        return _session;
      }
    },
    [session, onSessionConnected]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);
      const _client = await SignClient.init({
        core,
        logger: "debug",
        relayUrl: "wss://wallet-connectrelay.ternoa.network/",
        projectId: "85f16beb581a579b42b07358e7d51f77",
        metadata: DEFAULT_APP_METADATA,
      });
      console.log("CREATED CLIENT: ", _client);
      await subscribeToEvents(_client);
      await checkPersistedState(_client);
      setClient(_client);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [checkPersistedState, subscribeToEvents]);

  const request = async (hashTX: string) => {
    if (client) {
      return await client.request({
        chainId:"ternoa:18bcdb75a0bba577b084878db2dc2546",
        topic: session.topic,
        request: {
          method: "sign_message",
          params: {
            pubKey: account,
            request: {
              nonce: -1,
              submit: true,
              hash: hashTX
            },
          },
        },
      });
    } else {
      throw new Error("Client not available");
    }
  };

  const listNFTFunction = useCallback(async (nftId, nftPrice) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    console.log(client);

    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await listNftTx(nftId, 386, nftPrice);
    request(tx);
    

  }, [client, session, request]);

  const unlistNFTFunction = useCallback(async (nftId) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await unlistNftTx(nftId)
    request(tx);
  }, [client, session, request]);

  const buyNftFunction = useCallback(async (nftId, nftPrice) => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session not connected");
    }
    await initializeApi("wss://alphanet.ternoa.com");
    const tx = await buyNftTx(nftId, nftPrice);
    request(tx);
  }, [client, session, request]);

  

  useEffect(() => {
    if (!client && !initialized.current) {
      initialized.current = true;
      createClient();
    }
  }, [client, createClient]);

  return (
    <WalletConnectContext.Provider
      value={{
        pairings,
        isInitializing,
        isConnecting,
        isDisconnecting,
        isConnected,
        account,
        client,
        session,
        connect,
        disconnect,
        request,
        isCreatingUri,
        listNFTFunction,
        unlistNFTFunction,
        buyNftFunction,
      }}
    >
      
      {children}
    </WalletConnectContext.Provider>
  );
};

export default WalletConnectProvider;
