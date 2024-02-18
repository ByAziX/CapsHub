import React, { useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {
  Button,
  Text,
  Spinner,
  useToast,
  Flex,
  VStack,
  HStack,
  Avatar,
  Tooltip,
  IconButton,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  Icon
} from '@chakra-ui/react';
import { CopyIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import WalletModal from '../../modals/WalletModal';
import { FaWallet } from 'react-icons/fa';
import { useWalletConnect } from './WalletConnectProvider';

type TExtensionState = {
  data?: {
    accounts: InjectedAccountWithMeta[],
    defaultAccount: InjectedAccountWithMeta,
  },
  loading: boolean,
  error: null | Error,
};

const initialExtensionState: TExtensionState = {
  data: undefined,
  loading: false,
  error: null,
};

export const Connect = () => {
  const buttonHoverBg = useColorModeValue('purple.500', 'purple.200');
  const buttonActiveBg = useColorModeValue('purple.700', 'purple.400');
  const [state, setState] = useState(initialExtensionState);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard(state.data?.defaultAccount.address || '');
  const { address, listNFTFunction, unlistNFTFunction, disconnect } = useWalletConnect();
  const addressWallet = address || state.data?.defaultAccount.address;

  const handleConnectToWallet = async (walletName: string) => {
    setState({ ...initialExtensionState, loading: true });
  
    try {
      let accounts;
      let injectedExtensions;
  
      switch (walletName) {
        case 'polkadot.js':
          injectedExtensions = await web3Enable('my-dapp');
          if (injectedExtensions.length === 0) throw new Error('Please install Polkadot.js extension!');
          accounts = await web3Accounts();
          if (accounts.length === 0) throw new Error('No accounts found in Polkadot.js extension!');
          break;
        default:
          throw new Error(`Unsupported wallet: ${walletName}`);
      }
  
      setState({
        error: null,
        loading: false,
        data: {
          accounts,
          defaultAccount: accounts[0],
        }
      });
  
      onClose(); 
    } catch (error) {
      console.error('Error with connect', error);
      setState({ error, loading: false, data: undefined });
      toast({
        title: 'Connection error',
        description: error.message || 'Failed to connect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  const handleDisconnect = () => {
    if (state.data) {
      setState(initialExtensionState);
    }
    else if (address) {
      disconnect();
    }
  
  }
  

  return (
    <VStack spacing={4}>
      {addressWallet ? (
        <HStack spacing={4}>
          <NextLink href={`/profile/${addressWallet}`} passHref>
            <Avatar name={beautifyAddress(addressWallet)} />
          </NextLink>
          <VStack align="start">
            <Text fontSize="lg">Hello, {beautifyAddress(addressWallet)}</Text>
            <Tooltip label={addressWallet} aria-label="Full address">
              <Text fontSize="sm" cursor="pointer" onClick={onCopy}>{hasCopied ? "Copied!" : "Click to copy"}</Text>
            </Tooltip>
          </VStack>
          <IconButton aria-label="Disconnect" icon={<CloseIcon />} onClick={handleDisconnect} />
        </HStack>
      ) : (
        <Button leftIcon={<Icon as={FaWallet} />} onClick={onOpen} bg="transparent" _hover={{ bg: buttonHoverBg }} _active={{ bg: buttonActiveBg }}>
          Connect
        </Button>
      )}
      {isOpen && <WalletModal isOpen={isOpen} onClose={onClose} onConnect={handleConnectToWallet} />}
    </VStack>
  );
};

function beautifyAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
export default Connect;
