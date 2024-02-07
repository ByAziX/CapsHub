import React, { useState, useEffect } from 'react';
import {
  Box, Image, Text, useColorModeValue, Badge, VStack, HStack, AspectRatio, Skeleton
} from '@chakra-ui/react';
import { CollectionEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface CollectionCardProps {
  item: CollectionEntity;
  width?: string | number;
  height?: string | number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  item,
  width = '300px', // Default width for the card
  height = 'auto', // Auto height for flexible content
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    if (item) {
      setIsLoading(false);
    }
  }
  , [item]);


  const handleCollectionClick = () => {
    window.location.href = `/collection/${item?.collectionId}`;
  };

  return (
    <MotionBox
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      color={textColor}
      shadow="md"
      width={width}
      height="100%"
      m={2}
      whileHover={{ scale: 1.02, shadow: "lg" }}
      onClick={handleCollectionClick}
      style={{ cursor: 'pointer' }}
      position="relative"
    >
      {isLoading ? (
        <>
          <Skeleton width="100%" height="200px" /> {/* Skeleton for banner image */}
          <VStack p="2" align="left" spacing={4}>
            <Skeleton borderRadius="full" boxSize="50px" /> {/* Skeleton for profile image */}
            <Skeleton height="20px" width="70%" /> {/* Skeleton for title */}
            <Skeleton height="15px" width="60%" /> {/* Skeleton for badges */}
            <Skeleton height="15px" width="50%" /> {/* Additional skeleton for any other text or badges */}
          </VStack>
        </>
      ) : (
        <>
          <AspectRatio ratio={4 / 3}>
            <Image
              src={item?.bannerUrl || 'https://via.placeholder.com/100'}
              alt={`Banner for collection ${item?.collectionId || 'unknown'}`}
              objectFit="contain"
            />
          </AspectRatio>
          <VStack p="2" align="left" spacing={1}>
            <HStack spacing={2} align="center">
              <Image
                borderRadius="full"
                boxSize="50px"
                src={item?.profileUrl || 'https://via.placeholder.com/50'}
                alt={`Logo for collection ${item?.collectionId}`}
                fallbackSrc='https://via.placeholder.com/50'
              />
              <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="purple">Collection ID: {item.collectionId}</Badge>
              <Badge colorScheme="purple">{item.nbNfts} NFTs</Badge>
            </HStack>
            <HStack>
              <Badge colorScheme={item.isClosed ? "red" : "gray"}>{item.isClosed ? 'Closed ✓' : 'Not Closed ✕'}</Badge>
              <Badge colorScheme={item.hasReachedLimit ? "green" : "gray"}>{item.hasReachedLimit ? `Limit ✓` : 'Unlimited ✕'}</Badge>
            </HStack>
          </VStack>
        </>
      )}
    </MotionBox>
  );
};

export default CollectionCard;
