// components/NFTList.tsx
import React from 'react';
import { SimpleGrid, VStack, Heading } from '@chakra-ui/react';
import { CollectionListProps } from '../../interfaces/interfaces';
import CollectionCard from '../collection/CollectionCard';




const CollectionList: React.FC<CollectionListProps> = ({ collections,totalCount,isLoading }) => {
  
  return (
    <VStack spacing={5} my="10">
      <Heading as="h2" size="xl">
    {`Explore ${totalCount} Collections`}
  </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing="4">
            {collections.map((collection) => <CollectionCard key={collection.collectionId} item={collection} initialIsLoading={isLoading}/>)}
        </SimpleGrid>

    </VStack>
  );
};

export default CollectionList;
