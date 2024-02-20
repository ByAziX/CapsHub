import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  Badge,
  Button,
  VStack,
  Divider,
  useColorModeValue,
  SkeletonText,
  Skeleton,
  Alert,
  AlertIcon,
  Container,
  Link,
  Input,

} from '@chakra-ui/react';
import { getNftData } from '../../services/nftService';
import NextLink from 'next/link';
import { useWalletConnect } from '../../components/navbar/WalletConnectProvider';
import dynamic from 'next/dynamic';
import { usePolkadotConnect } from '../../components/navbar/PolkadotProvider';
import { useWalletActions } from '../../hooks/useWalletActions';


const NFTDetailsPage = ({ nft }) => {
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [listingPrice, setListingPrice] = useState<number>(10);
  const { listNFT, unlistNFT, buyNFT,address,defaultAccount } = useWalletActions();

  // choose the right account
  const account = address || defaultAccount?.address;

  if (!nft) {
    // If the NFT data is not yet loaded, display a loading state
    return (
      <Container centerContent py={10}>
        <Skeleton height="400px" width="400px" />
        <Box py={6}>
          <SkeletonText noOfLines={4} spacing="4" />
        </Box>
      </Container>
    );
  }



  // Once the NFT data is loaded, display the content
  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: 'column', md: 'row' }} bg={bgColor} boxShadow="xl" rounded="lg" overflow="hidden">
        <Box>
          <Image
            src={nft.mediaUrl || 'https://via.placeholder.com/400'}
            alt={`NFT ${nft.metadata?.title || ''}`}
            objectFit="contain"
            boxSize="auto"
            borderRadius="lg"
          />
        </Box>
        <Box flex="1" p={5}>
          <VStack align="start" spacing={4}>
            <Heading as="h1" size="2xl">
              {nft.metadata?.title || 'NFT Title'}
            </Heading>
            <Text fontSize="lg" color={textColor}>
              {nft.metadata?.description || 'NFT Description'}
            </Text>
            {nft.collection && (
              <Badge colorScheme="purple" p={2}>
                <Link as={NextLink} href={`../collection/${nft.collection.collectionId}`} passHref>
                  Collection #{nft.collection.collectionId}
                </Link>
              </Badge>
            )}
            <Divider borderColor={borderColor} my={4} />
            {nft.collection && !nft.collection.isClosed && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                This NFT belongs to a collection not closed!
              </Alert>
            )}
            <Text fontWeight="bold">Owner:</Text>
            <Link as={NextLink} href={`../profile/${nft.owner}`} passHref>
              {nft.owner}
            </Link>
            <Text fontWeight="bold">Creator:</Text>
            <Link as={NextLink} href={`../profile/${nft.creator}`} passHref>
              {nft.creator}
            </Link>
            {nft.isListed && (
              <><Badge colorScheme="green">Listed for sale</Badge><Text fontWeight="bold" my={4}>
                Price: {nft.priceRounded} CAPS
              </Text></>
            )}
            <Flex>
            {address === nft.owner && !nft.isListed && (
            <>
              <Input
                placeholder="Enter listing price"
                type="number"
                value={listingPrice}
                onChange={(e) => setListingPrice(parseFloat(e.target.value))}
                mr={4}
                mb={4}
              />
              <Button colorScheme="purple" onClick={() => listNFT(nft.nftId, listingPrice)}>
                List NFT
              </Button>
            </>
          )}

            {account && account === nft.owner   && nft.isListed && (
              <Button colorScheme="purple" mr={4} onClick={() => unlistNFT(nft.nftId)}> 
                Unlist NFT
              </Button>
            )}

            {account && nft.isListed && account !== nft.owner && (
              <Box display="flex" alignItems="center">
                <Button colorScheme="purple" mr={2} onClick={() => buyNFT(nft.nftId, nft.priceRounded)}>
                  Buy Now
                </Button>
                <Button variant="outline" colorScheme="purple">
                  Make Offer
                </Button>
              </Box>
            )}
            {!account && (
             <Alert status="error" borderRadius="md">
             <AlertIcon />
             You must be logged in to interact with the NFT.
                        </Alert>
            )}
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { nftId } = context.params;
  try {
    const nft = await getNftData(nftId);
    return { props: { nft } };
  } catch (error) {
    console.error('Error fetching NFT details:', error);

    return { props: { nft: null } };
  }
}

export default NFTDetailsPage;
