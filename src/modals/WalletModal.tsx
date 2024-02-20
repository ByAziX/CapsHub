import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { FaDotCircle, FaWallet } from 'react-icons/fa'; // Importer des icônes
import { useWalletConnect } from '@/components/navbar/WalletConnectProvider';
import { usePolkadotConnect } from '@/components/navbar/PolkadotProvider';


const WalletModal = ({ isOpen, onClose }) => {
  const buttonBg = useColorModeValue('purple.500', 'purple.200');
  const buttonText = useColorModeValue('white', 'gray.800');
  const { connectPolkadot } = usePolkadotConnect();
  const { connect,pairings } = useWalletConnect();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect to a Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button 
              leftIcon={<Icon as={FaDotCircle} />} // Utiliser FaDotCircle pour Polkadot.js
              w="full" 
              bg={buttonBg} 
              color={buttonText} 
              _hover={{ bg: 'purple.600' }}
              onClick={async () => {
                await connectPolkadot();
                onClose();
              }}
            >
              Polkadot.js
            </Button>

            <Button 
              leftIcon={<Icon as={FaWallet} />} // Utiliser FaWallet pour WalletConnect
              w="full" 
              bg={buttonBg} 
              color={buttonText} 
              _hover={{ bg: 'purple.600' }}
              onClick={async () => {
                await connect(pairings);
                onClose();
              }}
            >
              WalletConnect
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
