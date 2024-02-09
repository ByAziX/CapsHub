import React, { useState, useEffect, useRef } from 'react';
import { Box, Spinner, Flex, useColorModeValue } from '@chakra-ui/react';

import CollectionList from '../../components/explore/CollectionList';
import { CollectionEntity } from '../../interfaces/interfaces'; // Assurez-vous que cette interface est correcte

const DEFAULT_LIMIT = 24;

const ExploreCollectionsPage = () => {
  const [loadedCollections, setLoadedCollections] = useState<CollectionEntity[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const spinnerColor = useColorModeValue('purple.500', 'purple.200');

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/collections?limit=${DEFAULT_LIMIT}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setLoadedCollections(data.collections);
        setTotalCount(data.totalCount);
        setOffset(DEFAULT_LIMIT);
      })
      .catch((err) => console.error("Error loading collections:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Observer pour charger plus de collections au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedCollections.length < totalCount && !isLoading) {
          setIsLoading(true);
          fetch(`/api/collections?limit=${DEFAULT_LIMIT}&offset=${offset}`)
            .then((res) => res.json())
            .then((data) => {
              setLoadedCollections((prev) => [...prev, ...data.collections]);
              setOffset((prevOffset) => prevOffset + DEFAULT_LIMIT);
            })
            .catch((err) => console.error("Error loading more collections:", err))
            .finally(() => setIsLoading(false));
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer.disconnect();
  }, [offset, totalCount, loadedCollections.length, isLoading]);

  return (
    <Box>
      <CollectionList collections={loadedCollections} totalCount={totalCount} isLoading={isLoading} />
      {isLoading && (
        <Flex justify="center" align="center" my="2px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={spinnerColor} size="xl" />
        </Flex>
      )}
      <div ref={sentinel} style={{ height: '2px', margin: '2px' }}></div>
    </Box>
  );
};

export default ExploreCollectionsPage;
