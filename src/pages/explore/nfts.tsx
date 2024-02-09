import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Spinner, Flex, useColorModeValue } from '@chakra-ui/react';

import NFTList from '../../components/explore/NFTList';
import { NFTEntity } from '../../interfaces/interfaces'; // Assurez-vous que cette interface est correcte

const DEFAULT_LIMIT = 24;

const ExplorePage = () => {
  const [loadedNfts, setLoadedNfts] = useState<NFTEntity[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const inputFocusBorderColor = useColorModeValue('purple.500', 'purple.200');
  const router = useRouter();
  const sortBy = router.query.NFTSort as string || 'TIMESTAMP_LISTED_DESC';

  useEffect(() => {
    // Charger les données initiales
    setIsLoading(true);
    fetch(`/api/nfts?limit=${DEFAULT_LIMIT}&offset=${offset}&sortBy=${sortBy}`)
      .then((res) => res.json())
      .then((data) => {
        setLoadedNfts(data.nfts);
        setTotalCount(data.totalCount);
        setOffset(DEFAULT_LIMIT);
      })
      .catch((err) => console.error("Error loading NFTs:", err))
      .finally(() => setIsLoading(false));
  }, [sortBy]);

  useEffect(() => {
    // Logique pour charger plus de NFTs lors du scroll
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
  }, [offset, totalCount, loadedNfts.length, isLoading, sortBy]);

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

export default ExplorePage;
