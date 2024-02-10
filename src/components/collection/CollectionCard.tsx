import React, { useState, useEffect } from 'react';
import { Box, Text, useColorModeValue, Badge, VStack, HStack, AspectRatio, Skeleton, Tooltip, Spacer } from '@chakra-ui/react';
import { CollectionEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);

interface CollectionCardProps {
  item: CollectionEntity;
  width?: string | number;
  height?: string | number;
  initialIsLoading: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  item,
  width = '300px',
  height = 'auto',
  initialIsLoading,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isLoading, setIsLoading] = useState(initialIsLoading);

  useEffect(() => {
    if (item) {
      setIsLoading(false);
    }
  }, [item]);

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
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      onClick={handleCollectionClick}
      style={{ cursor: 'pointer' }}
      position="relative"
      display="flex" // Utiliser Flexbox
      flexDirection="column" // Orientation verticale
    >
      {isLoading ? (
        <>
          <Skeleton width="100%" height="200px" />
          <VStack p="2" align="left" spacing={1}>
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="100%" />
          </VStack>
        </>
      ) : (
        <>
          <AspectRatio ratio={3 / 2}>
            <Image
              src={item?.bannerUrl || 'https://via.placeholder.com/100'}
              alt={`Banner for collection ${item?.collectionId}`}
              quality={55}
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              width={500}
              height={300}
              style={{ objectFit: 'cover' }}
              loading='lazy'
            />
          </AspectRatio>
          <VStack p="2" align="left" spacing={1}>
            <HStack spacing={2} align="center">
              <Image
                src={item?.profileUrl || 'https://via.placeholder.com/50'}
                alt={`Logo for collection ${item?.collectionId}`}
                width={50}
                height={50}
                quality={55}
                style={{ borderRadius: '20%',width:"40px",height:"auto" }}
                loading='lazy'


              />
              <Tooltip label={item.name} aria-label="Collection name">
                <Text fontSize="lg" fontWeight="bold" isTruncated>{item.name}</Text>
              </Tooltip>
            </HStack>
            </VStack>
            <Spacer />
            <Box p="2">
      <VStack align="flex-start">
            <HStack>
              <Badge colorScheme="purple" isTruncated>Collection ID: {item.collectionId}</Badge>
              <Badge colorScheme="purple" isTruncated>{item.nbNfts} NFTs</Badge>
            </HStack>
            <HStack>
              <Badge colorScheme={item.isClosed ? "red" : "gray"} isTruncated>{item.isClosed ? 'Closed ✓' : 'Not Closed ✕'}</Badge>
              <Badge colorScheme={item.hasReachedLimit ? "green" : "gray"} isTruncated>{item.hasReachedLimit ? `Limit ✓` : 'Unlimited ✕'}</Badge>
            </HStack>
          </VStack>
        </Box>
        </>
      )}
    </MotionBox>
  );
};

export default CollectionCard;
