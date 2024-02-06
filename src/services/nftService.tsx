// nftService.tsx
import { request, gql } from 'graphql-request';
import { TernoaIPFS } from 'ternoa-js';
import cache from './redisClient'; // Utilisez le client de cache amélioré
import { CollectionEntity, CollectionResponse, NFTEntity, NFTResponse } from '../interfaces/interfaces';

// Initialisez le client IPFS avec vos paramètres d'environnement
const ipfsClient = new TernoaIPFS(new URL(process.env.IPFS_GATEWAY!), process.env.IPFS_API_KEY);

// Fonction pour récupérer les métadonnées IPFS
const fetchIPFSMetadata = async (offchainData: string): Promise<{ metadata: any; mediaUrl: string }> => {
  const defaultImageHash = "QmNsqeXwMtpfpHTtCJHMMWp924HrGL85AnVjEEmDHyUkBg";
  const cacheKey = `ipfs:${offchainData}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const metadata = await ipfsClient.getFile(offchainData) as any;
    const mediaUrl = metadata?.properties?.media && metadata.properties.media.hash 
      ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.properties.media.hash}`
      : `${process.env.IPFS_GATEWAY}/ipfs/${defaultImageHash}`;

    await cache.set(cacheKey, JSON.stringify({ metadata, mediaUrl }), 10000);

    return { metadata, mediaUrl };
  } catch (error) {
    console.error(`Error fetching metadata from IPFS:`, error);
    return { metadata: null, mediaUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultImageHash}` };
  }
};


export const getNftData = async (id: string): Promise<NFTEntity> => {
  const cacheKey = `nft:${id}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const gqlQuery = gql`
    {
      nftEntity(id: "${id}") {
        owner
        creator
        nftId
        offchainData
        royalty
        priceRounded
        typeOfListing
        isListed
        collection {
          collectionId
          owner
          offchainData
          nfts
          nbNfts
          limit
          hasReachedLimit
          isClosed
          timestampCreated
          timestampBurned
          timestampClosed
          timestampLimited

        }
      }
    }
  `;

  try {
    const response = await request<{ nftEntity: NFTEntity }>(process.env.GRAPHQL_ENDPOINT, gqlQuery);
    const nft = response.nftEntity;
    const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);

    await cache.set(cacheKey, JSON.stringify({ ...nft, metadata, mediaUrl }), 3600); // Cache pour 1 heure
    
    return { ...nft, metadata, mediaUrl };
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw new Error('Error fetching NFT');
  }
};
// Récupère les NFTs appartenant à un propriétaire spécifique avec pagination
export const getNFTfromOwner = async (owner: string, limit = 10, offset = 0, sortBy = 'TIMESTAMP_CREATED_DESC'): Promise<{ nfts: NFTEntity[], totalCount: number }> => {
  const cacheKey = `ownerNFTs:${owner}:${limit}:${offset}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const gqlQuery = gql`
    query GetNFTsFromOwner($owner: String!, $first: Int!, $offset: Int!) {
      nftEntities(
        filter: { owner: { equalTo: $owner } }
        first: $first
        offset: $offset
        orderBy: ${sortBy}
      ) {
        totalCount
        nodes {
          nftId
          owner
          creator
          collectionId
          offchainData
          priceRounded
          typeOfListing
          isListed
          collection {
            collectionId
          }
        }
      }
    }
  `;

  try {
    const response = await request<NFTResponse>(process.env.GRAPHQL_ENDPOINT!, gqlQuery, {
      owner,
      first: limit,
      offset
    });

    const nfts = await Promise.all(response.nftEntities.nodes.map(async (nft) => {
      const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
      return { ...nft, metadata, mediaUrl };
    }));

    await cache.set(cacheKey, JSON.stringify({ nfts, totalCount: response.nftEntities.totalCount }), 3600); // Cache pour 1 heure

    return { nfts, totalCount: response.nftEntities.totalCount };
  } catch (error) {
    console.error('Error fetching NFTs from owner:', error);
    throw new Error('Error fetching NFTs from owner');
  }
};


// Fonction pour récupérer la liste des NFTs avec pagination
export const getLastListedNFTs = async (limit = 10, offset = 0,sortBy = 'TIMESTAMP_LISTED_DESC'): Promise<{ nfts: NFTEntity[], totalCount: number }> => {
  const cacheKey = `nfts:${limit}:${offset}:${sortBy}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const gqlQuery = gql`
    query GetNFTs($first: Int!, $offset: Int!) {
      nftEntities(first: $first, offset: $offset,filter: { isListed: { equalTo: true } }, orderBy: ${sortBy}) {
        totalCount
        nodes {
          nftId
          owner
          creator
          collectionId
          offchainData
          priceRounded
          typeOfListing
          isListed
          collection {
            collectionId
          }
        }
      }
    }
  `;

  try {
    const response = await request<NFTResponse>(process.env.GRAPHQL_ENDPOINT!, gqlQuery, {
      first: limit,
      offset
    });

    const nfts = await Promise.all(response.nftEntities.nodes.map(async (nft) => {
      const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
      return { ...nft, metadata, mediaUrl };
    }));

    await cache.set(cacheKey, JSON.stringify({ nfts, totalCount: response.nftEntities.totalCount }), 10);

    return { nfts, totalCount: response.nftEntities.totalCount };
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error('Error fetching NFTs');
  }
};


// Récupère les NFTs appartenant à un propriétaire spécifique avec pagination
export const getNFTfromCollection = async (collectionid: string, limit = 10, offset = 0, sortBy = 'PRICE_ROUNDED_ASC'): Promise<{ nfts: NFTEntity[], totalCount: number }> => {
  const cacheKey = `collectionNFTs:${collectionid}:${limit}:${offset}:${sortBy}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const gqlQuery = gql`
    query GetNFTsFromOwner($collectionid: String!, $first: Int!, $offset: Int!) {
      nftEntities(
        filter: { collectionId: { equalTo: $collectionid }}
        first: $first
        offset: $offset
        orderBy: ${sortBy}
      ) {
        totalCount
        nodes {
          nftId
          owner
          creator
          collectionId
          offchainData
          priceRounded
          typeOfListing
          isListed
          collection {
            collectionId
          }
        }
      }
    }
  `;

  try {
    const response = await request<NFTResponse>(process.env.GRAPHQL_ENDPOINT!, gqlQuery, {
      collectionid,
      first: limit,
      offset
    });

    const nfts = await Promise.all(response.nftEntities.nodes.map(async (nft) => {
      const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
      return { ...nft, metadata, mediaUrl };
    }));

    await cache.set(cacheKey, JSON.stringify({ nfts, totalCount: response.nftEntities.totalCount }), 3600); // Cache pour 1 heure

    return { nfts, totalCount: response.nftEntities.totalCount };
  } catch (error) {
    console.error('Error fetching NFTs from owner:', error);
    throw new Error('Error fetching NFTs from owner');
  }
};