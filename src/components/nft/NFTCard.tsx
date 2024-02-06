import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Image, Text, Skeleton, VStack, useColorModeValue, Tooltip, Link, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NFTEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Corrigé pour utiliser `item` comme prop au lieu de `nft`
const NFTCard: React.FC<{ item: NFTEntity; width?: string | number; height?: string | number }> = ({
  item, // Utilisation de `item` ici
  width = '200px', 
  height = '340px',
}) => {
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const textColor = useColorModeValue('light.text', 'dark.text');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const handleBoxClick = () => {
    router.push(`/nft/${item.nftId}`);
  };

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  return (
    <MotionBox
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      color={textColor}
      shadow="md"
      whileHover={{ scale: 1.02, shadow: "lg" }}
      onClick={handleBoxClick}
      cursor="pointer"
      width={width} 
      height={height}
      transition={{ duration: 0.2 }}
    >
      <Box position="relative" height={width}  overflow="hidden">
        {isLoading && <Skeleton height={width} />}
        <Image
          src={item?.mediaUrl || 'https://via.placeholder.com/100'}
          alt='NFT Image'
          fallbackSrc='https://via.placeholder.com/100'
          onLoad={handleImageLoaded}
          onError={handleImageError}
          style={{ display: isLoading ? 'none' : 'block', width: "100%", height: "100%", objectFit: 'contain' }}
        />
      </Box>
      <VStack p="2" align="left" spacing={1}>
        {item?.metadata?.title && (
          <Text fontSize="md" fontWeight="bold">
            {item.metadata.title}
          </Text>
        )}
        <Tooltip label="NFT id" aria-label="NFT id">
          <Link as={NextLink} href={`/nft/${item?.nftId}`} passHref>
            NFT N°{item?.nftId}
          </Link>
        </Tooltip>

        {item?.collection && (
          <Tooltip label="NFT collection id" aria-label="NFT collection">
            <Link as={NextLink} href={`/collection/${item?.collection?.collectionId}`} passHref>
                Collection N°{item?.collection.collectionId}
            </Link>
          </Tooltip>
        )}

        {item?.isListed && (
          <Badge colorScheme="green">Listed for sale</Badge>
        )}
        {item?.priceRounded && (
          <Text fontSize="xs" fontWeight="bold">
            Price: {item?.priceRounded} CAPS
          </Text>
        )}
      </VStack>
    </MotionBox>
  );
};

export default NFTCard;
