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
import WalletActions from '@/components/navbar/WalletActions';

const WalletModal = ({ isOpen, onClose, onConnect }) => {
  const buttonBg = useColorModeValue('purple.500', 'purple.200');
  const buttonText = useColorModeValue('white', 'gray.800');

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
              onClick={() => onConnect('polkadot.js')}
            >
              Polkadot.js
            </Button>

            <WalletActions/>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
