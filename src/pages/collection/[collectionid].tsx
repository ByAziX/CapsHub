import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Flex, Text, Image, Spinner, SimpleGrid, VStack, useColorModeValue, HStack, Link, Heading, useBreakpointValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { getCollectionFromID } from '../../services/collectionService';
import { getNFTfromCollection } from '../../services/nftService';
import { CollectionEntity, NFTEntity } from '../../interfaces/interfaces';
import NFTList from '../../components/explore/NFTList';

interface CollectionDetailsPageProps {
  collection: CollectionEntity;
  collectionid: string;
  sortBy: string;
}

const DEFAULT_LIMIT = 24;

const CollectionDetailsPage: NextPage<CollectionDetailsPageProps> = ({ collection, collectionid, sortBy }) => {
  const [loadedNfts, setLoadedNfts] = useState<NFTEntity[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const inputFocusBorderColor = useColorModeValue('purple.500', 'purple.200');


  
  // Fetch NFTs for the collection
  useEffect(() => {
    if (collectionid) {
      setIsLoading(true);
      fetch(`/api/collection-nfts/${collectionid}?limit=${DEFAULT_LIMIT}&offset=${offset}&sortBy=${sortBy}`)
        .then(res => res.json())
        .then(data => {
          setLoadedNfts(prev => [...prev, ...data.nfts]);
          setTotalCount(data.totalCount);
          setOffset(prevOffset => prevOffset + DEFAULT_LIMIT);
          setIsLoading(false);
        })
        .catch(err => console.error("Error loading more NFTs:", err));
    }
  }, [collectionid, offset, sortBy]);

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && loadedNfts.length < totalCount && !isLoading) {
        setIsLoading(true);
        fetch(`/api/collection-nfts/${collectionid}?limit=${DEFAULT_LIMIT}&offset=${offset}&sortBy=${sortBy}`)
          .then(res => res.json())
          .then(data => {
            setLoadedNfts(prev => [...prev, ...data.nfts]);
            setOffset(prevOffset => prevOffset + DEFAULT_LIMIT);
            setIsLoading(false);
          })
          .catch(err => console.error("Error loading more NFTs:", err));
      }
    }, { rootMargin: '100px' });

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer.disconnect();
  }, [loadedNfts, isLoading, totalCount, offset, collectionid, sortBy]);


  return (
    <VStack>
    <Box>
      {/* Collection Banner */}
      {collection.bannerUrl && (
        <Image src={collection.bannerUrl} alt={`${collection.name} banner`} mb={4} borderRadius="md" maxH="400px" w="full" objectFit="cover" />
      )}

      <VStack spacing={4} align="stretch">
        {/* Collection Logo and Name, with responsive logo size */}
        <Flex direction={{ base: 'column', md: 'row' }} padding={4} align="center" mb={4}>
          {collection.profileUrl && (
            // Responsive boxSize using array or object notation
            <Image src={collection.profileUrl} alt={`${collection.name} logo`} boxSize={{ base: '100px', md: '150px' }} borderRadius="full" objectFit="cover" border="4px solid white" mb={{ base: 4, md: 0 }} mr={{ md: 4 }} />
          )}
          <VStack align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
            <Heading as="h1" size="xl" mt={4}>{collection.name}</Heading>
            <Text fontSize="lg">{collection.description}</Text>
          </VStack>
        </Flex>
      </VStack>

    </Box>
    <Box>
        {/* NFT List */}
        <NFTList nfts={loadedNfts} totalCount={totalCount} sortBy={sortBy} isLoading={isLoading} />
        {isLoading && (
          <Flex justify="center" align="center">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={inputFocusBorderColor} size="xl" />
          </Flex>
        )}
        <Box ref={sentinel} h="20px" />
      </Box>
      </VStack>

  );
};



export const getServerSideProps: GetServerSideProps<CollectionDetailsPageProps> = async (context) => {
  const { params, query } = context;
  const collectionId = params?.collectionid as string;
  const sortBy = query.NFTSort as string || 'PRICE_ROUNDED_ASC';

  const { collection } = await getCollectionFromID(collectionId);

  return {
    props: {
      collection,
      collectionid: collectionId,
      sortBy,
    },
  };
};

export default CollectionDetailsPage;
