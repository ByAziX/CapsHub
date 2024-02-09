// components/NFTList.tsx
import React from 'react';
import { SimpleGrid, VStack, Heading } from '@chakra-ui/react';

import NFTCard from '../nft/NFTCard';
import {NFTListProps} from '../../interfaces/interfaces'
import SortFilterNFT from './SortFilterNFT';

const NFTList: React.FC<NFTListProps> = ({ nfts, totalCount,sortBy,initialIsLoading }) => {

  return (
    <VStack spacing={5} my="10">
      <Heading as="h2" size="lg">
    {`Explore ${totalCount} NFTs`}
  </Heading>
  <SortFilterNFT value={sortBy} />
      <SimpleGrid columns={{ base: 2, md: 6 }} spacing="4">
        {nfts.map((nft) => <NFTCard key={nft.nftId} item={nft} initialIsLoading={initialIsLoading} />)}
      </SimpleGrid>

    </VStack>
  );
};

export default NFTList;
