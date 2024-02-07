import React, { useState, useEffect } from 'react';
import {
  Box, Text, useColorModeValue, Badge, VStack, HStack, AspectRatio, Skeleton
} from '@chakra-ui/react';
import { CollectionEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Importer Image de next/image

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
  const [isLoading, setIsLoading] = useState(true);

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
      m={2}
      whileHover={{ scale: 1.02, shadow: "lg" }}
      onClick={handleCollectionClick}
      style={{ cursor: 'pointer' }}
      position="relative"
    >
      {isLoading ? (
        <>
          <Skeleton width="100%" height="200px" />
          {/* Autres skeletons */}
        </>
      ) : (
        <>
          <AspectRatio ratio={3 / 2}>
          <Image
  src={item?.bannerUrl || 'https://via.placeholder.com/100'}
  alt={`Banner for collection ${item?.collectionId}`}
  width={300}
  height={200}
  priority={true}
  quality={55}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
          </AspectRatio>
          {/* Le reste du composant reste inchangé */}
          <VStack p="2" align="left" spacing={1}>
            {/* Pour l'image de profil, assurez-vous d'encapsuler dans une div positionnée si nécessaire */}
            <HStack spacing={2} align="center">
              
              <Image
  src={item?.profileUrl || 'https://via.placeholder.com/50'}
  alt={`Logo for collection ${item?.collectionId}`}
  width={50}
  height={50}
  priority={true}
  style={{ borderRadius: '50%' }}
  sizes='50px'
  quality={55}
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