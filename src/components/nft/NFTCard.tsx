import React, { lazy, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Skeleton, VStack, useColorModeValue, Tooltip, Link, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NFTEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';
import Image from 'next/image';


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

  useEffect(() => {
    if (item) {
      setIsLoading(false);
    }
  }, [item]);

  const video_url = item.metadata.properties.media.type == "video/mp4" ? true : false;

  return (
    <MotionBox
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      color={textColor}
      shadow="md"
      whileHover={{ scale: 1.02 }}
      onClick={handleBoxClick}
      cursor="pointer"
      width={{base:"100%", md:width}}
      height={{base:"100%", md:height}}
      transition={{ duration: 0.2 }}
    >
      <Box position="relative" height={width}  overflow="hidden">
        {isLoading && <Skeleton height={width} />}
        {video_url && ( // Ajout de la condition pour afficher la vidéo
          <iframe src={item?.mediaUrl} width="100%" height="100%" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
        ) }
        {!isLoading && !video_url && ( 
          <Image
            src={item?.mediaUrl || 'https://via.placeholder.com/100'}
            alt={item?.metadata?.title || 'NFT Image'}
            priority={true}
            style={{ objectFit: 'contain'}}
            // 640 x 640, 768 x 768, 1200 x 1200, 1600 x 1600, 2000 x 2000
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 50vw, (max-width: 1600px) 33vw, 5vw"
            fill={true}
            


          />
        )}
      </Box>
      <VStack p="2" align="left" spacing={1}>
        {item?.metadata?.title && (
          <Text fontSize="md" fontWeight="bold" isTruncated>
            {item.metadata.title}
          </Text>
        )}
        <Tooltip label="NFT id" aria-label="NFT id">
          <Link as={NextLink} href={`/nft/${item?.nftId}`} passHref isTruncated>
            NFT N°{item?.nftId}
          </Link>
        </Tooltip>

        {item?.collection && (
          <Tooltip label="NFT collection id" aria-label="NFT collection">
            <Link as={NextLink} href={`/collection/${item?.collection?.collectionId}`} passHref isTruncated>
                Collection N°{item?.collection.collectionId}
            </Link>
          </Tooltip>
        )}

        {item?.isListed && (
          <Badge colorScheme="green" isTruncated>Listed for sale</Badge>
        )}
        {item?.priceRounded && (
          <Text fontSize="xs" fontWeight="bold" isTruncated>
            Price: {item?.priceRounded} CAPS
          </Text>
        )}
      </VStack>
    </MotionBox>
  );
};

export default NFTCard;
