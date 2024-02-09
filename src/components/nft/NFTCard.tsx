import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Skeleton, VStack, useColorModeValue, Tooltip, Link, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NFTEntity } from '../../interfaces/interfaces';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);

const NFTCard: React.FC<{
  item: NFTEntity;
  width?: string | number;
  height?: string | number;
  initialIsLoading: boolean;
}> = ({ item, width = '200px', height = '340px', initialIsLoading = true }) => {
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const textColor = useColorModeValue('light.text', 'dark.text');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initialIsLoading);

  const handleBoxClick = () => {
    router.push(`/nft/${item.nftId}`);
  };

  useEffect(() => {
    if (item) {
      setIsLoading(false);
    }
  }, [item]);

  const video_url = item?.metadata?.properties?.media?.type === "video/mp4";

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
      width={{ base: "100%", md: width }}
      height={{ base: "100%", md: height }}
      transition={{ duration: 0.2 }}
    >
      <Box position="relative" height={width} overflow="hidden">
        {isLoading ? (
          <Skeleton height={width} />
        ) : video_url ? (
          <iframe
            src={item?.mediaUrl}
            width="100%"
            height="100%"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <Image
            src={item?.mediaUrl || 'https://via.placeholder.com/100'}
            alt={item?.metadata?.title || 'NFT Image'}
            priority={true}
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 50vw, (max-width: 1600px) 33vw, 15vw"
            fill={true}
          />
        )}
      </Box>
      <VStack p="2" align="left" spacing={1}>
        <Skeleton isLoaded={!isLoading}>
          {item?.metadata?.title && (
            <Text fontSize="md" fontWeight="bold" isTruncated>
              {item.metadata.title}
            </Text>
          )}
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          <Tooltip label="NFT id" aria-label="NFT id">
            <Link as={NextLink} href={`/nft/${item?.nftId}`} passHref isTruncated>
              NFT N°{item?.nftId}
            </Link>
          </Tooltip>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {item?.collection && (
            <Tooltip label="NFT collection id" aria-label="NFT collection">
              <Link as={NextLink} href={`/collection/${item?.collection?.collectionId}`} passHref isTruncated>
                Collection N°{item?.collection.collectionId}
              </Link>
            </Tooltip>
          )}
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {item?.isListed && (
            <Badge colorScheme="green" isTruncated>Listed for sale</Badge>
          )}
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {item?.priceRounded && (
            <Text fontSize="xs" fontWeight="bold" isTruncated>
              Price: {item?.priceRounded} CAPS
            </Text>
          )}
        </Skeleton>
      </VStack>
    </MotionBox>
  );
};

export default NFTCard;
