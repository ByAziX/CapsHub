import React from 'react';
import { Box, Button, Center, Flex, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { DarkModeSwitch } from './DarkModeSwitch';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { FaBoxOpen } from 'react-icons/fa';
import {PiAddressBookBold} from 'react-icons/pi';
import { IoBookSharp } from "react-icons/io5";
import SearchBar from './SearchBar';
import WalletActions from './WalletActions'; // Ajustez le chemin selon votre structure de dossier


const Connect = dynamic(() => import('./Connect').then(m => m.Connect), {
  ssr: false,
});

const NavBar: React.FC = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const buttonHoverBg = useColorModeValue('purple.500', 'purple.200');
  const buttonActiveBg = useColorModeValue('purple.700', 'purple.400');

  return (

    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg={bgColor}
      color={textColor}
    >
      <Flex align="center">
        <NextLink href="/" passHref>
          <Flex align="center" cursor="pointer">
            <Image src="/nft-marketplace-background.webp" alt="Logo" boxSize="30px" mr="3" />
            <Text fontSize="xl" fontWeight="bold" mr="5">
              NFT Marketplace
            </Text>
          </Flex>
        </NextLink>
      </Flex>



      <Box flex="1" display={{ base: 'none', md: 'block' }}>
        <Center>
          <SearchBar onSearch={(query: any) => console.log('Searching for:', query)} />
        </Center>
      </Box>

      <IconButton
        display={['flex', 'flex', 'none', 'none']}
        onClick={isOpen ? onClose : onOpen}
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        aria-label="Open Menu"
        bg="transparent"
        size="lg"
      />

      <Box
        display={[isOpen ? 'block' : 'none', isOpen ? 'block' : 'none', 'none', 'none']}
        flexBasis={{ base: "100%", md: "auto" }}
        mt={[4, 4, 0, 0]}
      >
          <SearchBar onSearch={(query: any) => console.log('Searching for:', query)} />
      </Box>
      

      <Flex
        flexBasis={{ base: "100%", md: "auto" }}
        display={[isOpen ? "flex" : "none", isOpen ? "flex" : "none", "flex", "flex"]}
        ml={[0, 0, 4]}
        align="center"
        justify={[isOpen ? "center" : "space-between", isOpen ? "center" : "space-between", "space-between", "space-between"]}
        direction={["column", "column", "row", "row"]}
        pt={[4, 4, 0, 0]}
        gap={4}
      >
        <Menu>
                    <MenuButton as={Button} leftIcon={<FaBoxOpen />} rightIcon={<ChevronDownIcon />} bg="transparent" _hover={{ bg: buttonHoverBg }} _active={{ bg: buttonActiveBg }}>
                      Explore
                    </MenuButton>
          <MenuList>
            <NextLink href="/explore/nfts" passHref>
              <MenuItem>Explore NFTs</MenuItem>
            </NextLink>
            <NextLink href="/explore/collections" passHref>
              <MenuItem>Explore Collections</MenuItem>
            </NextLink>
          </MenuList>
        </Menu>
        
        <Button leftIcon={<PiAddressBookBold />}  bg="transparent" _hover={{ bg: buttonHoverBg }} _active={{ bg: buttonActiveBg }}>Create</Button>
        <Button leftIcon={<IoBookSharp />}  bg="transparent" _hover={{ bg: buttonHoverBg }} _active={{ bg: buttonActiveBg }}>My Collection</Button>
        <Connect />
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
};

export default NavBar;
