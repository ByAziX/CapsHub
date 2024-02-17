import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  VStack,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { CollectionEntity, NFTEntity } from '../interfaces/interfaces';
import Carousel from '../components/index/Carousel';
import FAQSection from '../components/index/FAQSection';
import NFTCard from '../components/nft/NFTCard';
import SiteTools from '../components/index/SiteTools';
import CollectionCard from '../components/collection/CollectionCard';

const IndexPage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-l, #7928CA, #9A4DFF)',
    'linear(to-l, #9A4DFF, #D6A4FF)'
  );
  const [nfts, setNfts] = useState<NFTEntity[]>([]);
  const [lastNft, setLastNft] = useState<NFTEntity | null>(null);
  const [collections, setCollections] = useState<CollectionEntity[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);

  // Charger les données des NFTs
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoadingNFTs(true);
        const res = await fetch('/api/nfts?limit=6&offset=0');
        const data = await res.json();
        setNfts(data.nfts);
        setLastNft(data.nfts[0]); // Assumant que le premier NFT est le dernier listé
        
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setIsLoadingNFTs(true);

      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchNFTs();
  }, []);

  // Charger les données des collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoadingCollections(true);

        const res = await fetch('/api/collections?limit=6&offset=0');
        const data = await res.json();
        setCollections(data.collections);

      } catch (error) {
        console.error("Error fetching collections:", error);
        setIsLoadingCollections(true);

      }finally {
        setIsLoadingCollections(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <Container maxW="container.xl" p={0}>
  <Flex
    direction={{ base: 'column', md: 'row' }}
    align="center"
    justify={{ base: 'center', md: 'center' }} // Aligner à droite sur les écrans plus larges
    my={10}
    p={5}
  >
    <VStack
      align="stretch" // S'assurer que les enfants de VStack prennent toute la largeur disponible
      spacing={4}
      maxW={{ md: '2xl' }} // Limiter la largeur maximale du VStack pour éviter une étendue excessive sur les grands écrans
    >
      <Heading as="h2" size="xl" mb={4} textAlign={{ base: 'center', md: 'left' }}>
        Collect &{' '}
        <Text as="span" bgClip="text" bgGradient={bgGradient} fontWeight="extrabold">
          Sell Super Rare NFTs
        </Text>
      </Heading>
      <Text fontSize="lg" mb={4} textAlign={{ base: 'center', md: 'left' }}>
        Produce an exclusive NFT collection of over 10,000 items by uploading the necessary layers, and prepare to market your collection for sale.
      </Text>
      <Flex justifyContent={{ base: 'center', md: 'left' }} mb={4}>
        <Button colorScheme="purple" marginRight={2}>
          Let's Start
        </Button>
        <Button variant="outline" colorScheme="purple">
          Join Discord
        </Button>
      </Flex>
    </VStack>

      <Box
        maxW={{ md: 'sm' }} // Limiter la largeur maximale de la Box pour le NFTCard
      >
        <NFTCard
          key={lastNft?.nftId}
          item={lastNft}
          initialIsLoading={isLoadingNFTs}
        />
      </Box>

  </Flex>

      <Heading size="lg" display="flex" alignItems="center" mb={4}>
        <Text as="span" fontWeight="bold">Featured Collections</Text>
      </Heading>
      <VStack spacing={5} my={10}>
        <Carousel items={collections} CardComponent={CollectionCard} isLoading={isLoadingCollections} />
      </VStack>

      <Heading size="lg" display="flex" alignItems="center" mb={4}>
        <Text as="span" fontWeight="bold">Last NFTs on Sale</Text>
      </Heading>
      <VStack spacing={5} my={10}>
        <Carousel items={nfts} CardComponent={NFTCard} isLoading={isLoadingNFTs}/>
      </VStack>

      <SiteTools />
      <FAQSection />
    </Container>
  );
};

export default IndexPage;
