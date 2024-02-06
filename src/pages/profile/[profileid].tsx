// Importations nécessaires depuis React, Next.js et Chakra UI
import React, { useState, useEffect, useRef } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Box, Spinner, Flex, useColorModeValue } from '@chakra-ui/react';

// Importations de vos services et composants personnalisés
import { getNFTfromOwner } from '../../services/nftService';
import NFTList from '../../components/explore/NFTList';
import { NFTListProps } from '../../interfaces/interfaces';

const DEFAULT_LIMIT = 24;

interface ProfilePageProps extends NFTListProps {
  profileid: string;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ nfts, totalCount, sortBy, profileid }) => {
  const [loadedNfts, setLoadedNfts] = useState(nfts);
  const [offset, setOffset] = useState(DEFAULT_LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const inputFocusBorderColor = useColorModeValue('purple.500', 'purple.200');


  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && loadedNfts.length < totalCount && !isLoading) {
        setIsLoading(true);
        fetch(`/api/profile-nfts/${profileid}?limit=${DEFAULT_LIMIT}&offset=${offset}&sortBy=${sortBy}`)
          .then(res => res.json())
          .then(data => {
            if (data.nfts && data.nfts.length > 0) {
              setLoadedNfts(prev => [...prev, ...data.nfts]);
              setOffset(prevOffset => prevOffset + data.nfts.length);
            }
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Error loading more NFTs:", err);
            setIsLoading(false);
          });
      }
    }, { rootMargin: '100px' });

    const currentSentinel = sentinel.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.disconnect();
      }
    };
  }, [offset, sortBy, totalCount, loadedNfts.length, isLoading, profileid]);

  return (
    <Box>
      <NFTList nfts={loadedNfts} totalCount={totalCount} sortBy={sortBy} />
      {isLoading && (
        <Flex justify="center" align="center" my="20px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={inputFocusBorderColor} size="xl" />
        </Flex>
      )}
      <Box ref={sentinel} h="20px" my="20px" />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  const { params, query } = context;
  const profileid = params?.profileid as string;
  const sortBy = query.NFTSort as string || 'TIMESTAMP_LISTED_DESC';
  const { nfts, totalCount } = await getNFTfromOwner(profileid, DEFAULT_LIMIT, 0, sortBy);

  return {
    props: {
      nfts,
      totalCount,
      sortBy,
      profileid,
    },
  };
};

export default ProfilePage;
