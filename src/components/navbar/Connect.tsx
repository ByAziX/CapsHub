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
import { usePolkadot } from './PolkadotProvider';

export const Connect = () => {
  const buttonHoverBg = useColorModeValue('purple.500', 'purple.200');
  const buttonActiveBg = useColorModeValue('purple.700', 'purple.400');
  const { accounts, defaultAccount, error, loading, disconnectPolkadot } = usePolkadot();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, listNFTFunction, unlistNFTFunction, disconnect } = useWalletConnect();
  const addressWallet = address || accounts?.[0]?.address || defaultAccount?.address || '';
  const { hasCopied, onCopy } = useClipboard(address || accounts?.[0]?.address || defaultAccount?.address);


  


  const handleDisconnect = () => {
    if (accounts?.[0]?.address || defaultAccount?.address) {
      disconnectPolkadot();
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
      {isOpen && <WalletModal isOpen={isOpen} onClose={onClose} />}
    </VStack>
  );
};

function beautifyAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
export default Connect;
