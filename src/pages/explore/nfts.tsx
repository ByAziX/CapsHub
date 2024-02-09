import React, { useState, useEffect, useRef, use } from 'react';
import { GetServerSideProps } from 'next';
import { Box, Spinner, Flex, useColorModeValue } from '@chakra-ui/react';

import { getLastListedNFTs } from '../../services/nftService';
import NFTList from '../../components/explore/NFTList';
import { NFTListProps } from '../../interfaces/interfaces';

const DEFAULT_LIMIT = 24;

const ExplorePage: React.FC<NFTListProps> = ({ nfts, totalCount, sortBy }) => {
  const [loadedNfts, setLoadedNfts] = useState(nfts);
  const [offset, setOffset] = useState(DEFAULT_LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const inputFocusBorderColor = useColorModeValue('purple.500', 'purple.200');

  useEffect(() => {
    setLoadedNfts([]);
    setOffset(0);
  }, [sortBy]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedNfts.length < totalCount && !isLoading) {
          setIsLoading(true);
          fetch(`/api/nfts?limit=${DEFAULT_LIMIT}&offset=${offset}&sortBy=${sortBy}`)
            .then((res) => res.json())
            .then((data) => {
              setLoadedNfts((prev) => [...prev, ...data.nfts]);
              setOffset((prevOffset) => prevOffset + DEFAULT_LIMIT);
            })
            .catch((err) => console.error("Error loading more NFTs:", err))
            .finally(() => setIsLoading(false));
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer.disconnect();
  }, [offset, totalCount, loadedNfts.length, isLoading]);

  return (
    <Box>
      <NFTList nfts={loadedNfts} totalCount={totalCount} sortBy={sortBy} isLoading={isLoading} />
      {isLoading && (
        <Flex justify="center" align="center" my="2px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={inputFocusBorderColor} size="xl" />
        </Flex>
      )}
      <Box ref={sentinel} h="2px" my="2px" />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<NFTListProps> = async (context) => {
  const sortBy = context.query.NFTSort as string || 'TIMESTAMP_LISTED_DESC';
  const { nfts, totalCount } = await getLastListedNFTs(DEFAULT_LIMIT, 0, sortBy);
  return {
    props: {
      nfts,
      totalCount,
      sortBy,
      isLoading: false,
    },
  };
};

export default ExplorePage;
