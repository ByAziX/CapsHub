import React from 'react';
import { Box, Text, Container, Flex, Spacer, Link, IconButton,useColorModeValue } from '@chakra-ui/react';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg={useColorModeValue('white', 'purple.400')} color={useColorModeValue('grey.700', 'grey.500')} mt="10">
      <Container maxW="container.xl" py="5">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
          <Text>&copy; {new Date().getFullYear()} NFT Marketplace. All rights reserved.</Text>
          <Spacer />
          <Flex pt={{ base: '4', md: '0' }}>
            <Link href="https://twitter.com" isExternal>
              <IconButton aria-label="Twitter" icon={<FaTwitter />} size="lg" variant="ghost" colorScheme="blue" mr="2" />
            </Link>
            <Link href="https://instagram.com" isExternal>
              <IconButton aria-label="Instagram" icon={<FaInstagram />} size="lg" variant="ghost" colorScheme="pink" mr="2" />
            </Link>
            <Link href="https://linkedin.com" isExternal>
              <IconButton aria-label="LinkedIn" icon={<FaLinkedin />} size="lg" variant="ghost" colorScheme="blue" mr="2" />
            </Link>
            <Link href="https://github.com" isExternal>
              <IconButton aria-label="GitHub" icon={<FaGithub />} size="lg" variant="ghost" />
            </Link>
          </Flex>
        </Flex>
        <Text fontSize="sm" textAlign="center" pt="4">Made with ❤️ by NFT Marketplace Team</Text>
      </Container>
    </Box>
  );
};

export default Footer;
