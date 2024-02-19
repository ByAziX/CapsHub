import { request, gql } from 'graphql-request';
import { TernoaIPFS } from 'ternoa-js';
import cache, {fetchCachedData} from './redisClient';
import {  NFTEntity, NFTResponse } from '../interfaces/interfaces';

const ipfsClient = new TernoaIPFS(new URL(process.env.IPFS_GATEWAY!), process.env.IPFS_API_KEY);

const fetchIPFSMetadata = async (offchainData: string): Promise<{ metadata: any; mediaUrl: string }> => {
  const defaultImageHash = "QmNsqeXwMtpfpHTtCJHMMWp924HrGL85AnVjEEmDHyUkBg";
  const cacheKey = `ipfs:${offchainData}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) return JSON.parse(cachedData);

  try {
    const metadata = await ipfsClient.getFile(offchainData) as any;
    const mediaUrl = metadata?.properties?.media?.hash
      ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.properties.media.hash}`
      : `${process.env.IPFS_GATEWAY}/ipfs/${defaultImageHash}`;

    const cacheValue = JSON.stringify({ metadata, mediaUrl });
    await cache.set(cacheKey, cacheValue, 10000);
    return { metadata, mediaUrl };
  } catch (error) {
    console.error(`Error fetching metadata from IPFS:`, error);
    return { metadata: null, mediaUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultImageHash}` };
  }
};

// Généralisation des requêtes GraphQL
async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  return request<T>(process.env.GRAPHQL_ENDPOINT!, query, variables);
}



export const getNftData = async (id: string): Promise<NFTEntity> => {
  const cacheKey = `nft:${id}`;
  return fetchCachedData<NFTEntity>(cacheKey, async () => {

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

  const response = await fetchGraphQL<{ nftEntity: NFTEntity }>(gqlQuery);
    const nft = response.nftEntity;
    const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
    return { ...nft, metadata, mediaUrl };
  });
};



// Récupère les NFTs appartenant à un propriétaire spécifique avec pagination
export async function getNFTfromOwner(owner: string, limit = 10, offset = 0, sortBy = 'TIMESTAMP_CREATED_DESC'): Promise<{ nfts: NFTEntity[], totalCount: number }> {
  const cacheKey = `ownerNFTs:${owner}:${limit}:${offset}:${sortBy}`;
  return fetchCachedData<{ nfts: NFTEntity[], totalCount: number }>(cacheKey, async () => {

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

  const variables = { owner, first: limit, offset, sortBy };
    const response = await fetchGraphQL<NFTResponse>(gqlQuery, variables);
    const nfts = await Promise.all(
      response.nftEntities.nodes.map(async (nft) => {
        const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
        return { ...nft, metadata, mediaUrl };
      })
    );
    return { nfts, totalCount: response.nftEntities.totalCount };
  }, 10);
}


// Fonction pour récupérer la liste des NFTs avec pagination
export async function getLastListedNFTs(limit = 10, offset = 0, sortBy = 'TIMESTAMP_LISTED_DESC'): Promise<{ nfts: NFTEntity[], totalCount: number }> {
  const cacheKey = `lastListedNFTs:${limit}:${offset}:${sortBy}`;
  return fetchCachedData<{ nfts: NFTEntity[], totalCount: number }>(cacheKey, async () => {

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

  const variables = { first: limit, offset, sortBy };
    const response = await fetchGraphQL<NFTResponse>(gqlQuery, variables);
    const nfts = await Promise.all(
      response.nftEntities.nodes.map(async (nft) => {
        const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
        return { ...nft, metadata, mediaUrl };
      })
    );
    return { nfts, totalCount: response.nftEntities.totalCount };
  }, 3600);
}


// Récupère les NFTs appartenant à un propriétaire spécifique avec pagination
export async function getNFTfromCollection(collectionId: string, limit = 10, offset = 0, sortBy = 'PRICE_ROUNDED_ASC'): Promise<{ nfts: NFTEntity[], totalCount: number }> {
  const cacheKey = `collectionNFTs:${collectionId}:${limit}:${offset}:${sortBy}`;
  return fetchCachedData<{ nfts: NFTEntity[], totalCount: number }>(cacheKey, async () => {

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

  const variables = { collectionid: collectionId, first: limit, offset, sortBy };
    const response = await fetchGraphQL<NFTResponse>(gqlQuery, variables);
    const nfts = await Promise.all(
      response.nftEntities.nodes.map(async (nft) => {
        const { metadata, mediaUrl } = await fetchIPFSMetadata(nft.offchainData);
        return { ...nft, metadata, mediaUrl };
      })
    );
    return { nfts, totalCount: response.nftEntities.totalCount };
  }
  );
}
