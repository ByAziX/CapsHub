// nftService.tsx
import { request, gql } from 'graphql-request';
import { TernoaIPFS } from 'ternoa-js';
import cache, {fetchCachedData} from './redisClient'; 
import { CollectionEntity, CollectionResponse } from '../interfaces/interfaces';

const ipfsClient = new TernoaIPFS(new URL(process.env.IPFS_GATEWAY!), process.env.IPFS_API_KEY);


const fetchIPFSMetadataCollection = async (offchainData: string): Promise<{ metadata: any; bannerUrl: string, profileUrl: string }> => {
  const defaultBannerHash = "QmNsqeXwMtpfpHTtCJHMMWp924HrGL85AnVjEEmDHyUkBg";
  const defaultProfileHash = "QmNsqeXwMtpfpHTtCJHMMWp924HrGL85AnVjEEmDHyUkBg";
  const cacheKey = `ipfs:collection:${offchainData}`;
  return fetchCachedData<{ metadata: any; bannerUrl: string, profileUrl: string }>(cacheKey, async () => {
    try {
      const metadata = await ipfsClient.getFile(offchainData) as any;
      const bannerUrl = metadata?.banner_image ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.banner_image}` : `${process.env.IPFS_GATEWAY}/ipfs/${defaultBannerHash}`;
      const profileUrl = metadata?.profile_image ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.profile_image}` : `${process.env.IPFS_GATEWAY}/ipfs/${defaultProfileHash}`;
      return { metadata, bannerUrl, profileUrl };
    } catch (error) {
      console.error(`Error fetching collection metadata from IPFS:`, error);
      return { metadata: null, bannerUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultBannerHash}`, profileUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultProfileHash}` };
    }
  }, 10000);
};

// Généralisation des requêtes GraphQL
async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  return request<T>(process.env.GRAPHQL_ENDPOINT!, query, variables);
}



export const getCollections = async (limit = 10, offset = 0): Promise<{ collections: CollectionEntity[], totalCount: number }> => {
  const cacheKey = `collections:${limit}:${offset}`;
  return fetchCachedData<{ collections: CollectionEntity[], totalCount: number }>(cacheKey, async () => {
  
    const gqlQuery = gql`
      query GetCollections($first: Int!, $offset: Int!) {
        collectionEntities(first: $first, offset: $offset, orderBy: TIMESTAMP_CREATED_DESC) {
          totalCount
          nodes {
            collectionId
            owner
            offchainData
            nfts
            nbNfts
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
  
    const response = await fetchGraphQL<CollectionResponse>(gqlQuery, { first: limit, offset });
    const collections = await Promise.all(
      response.collectionEntities.nodes.map(async (collection) => {
        const { metadata, bannerUrl, profileUrl } = await fetchIPFSMetadataCollection(collection.offchainData);
        return { ...collection, ...metadata, bannerUrl, profileUrl };
      })
    );
    return { collections, totalCount: response.collectionEntities.totalCount };
  }, 3600);
};

export const getCollectionFromID = async (collectionID: string): Promise<{ collection: CollectionEntity }> => {
  const cacheKey = `collections:${collectionID}`;
  return fetchCachedData<{ collection: CollectionEntity }>(cacheKey, async () => {
  
    const gqlQuery = gql`
      query GetCollections($collectionID: String!) {
        collectionEntities(filter: { id: { equalTo: $collectionID } }) {
          totalCount
          nodes {
            collectionId
            owner
            offchainData
            nfts
            nbNfts
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
  
    const response = await fetchGraphQL<CollectionResponse>(gqlQuery, { collectionID });
    if (response.collectionEntities.nodes.length > 0) {
      const collection = response.collectionEntities.nodes[0];
      const { metadata, bannerUrl, profileUrl } = await fetchIPFSMetadataCollection(collection.offchainData);
      return { collection: { ...collection, ...metadata, bannerUrl, profileUrl } };
    } else {
      throw new Error('Collection not found');
    }
  }, 3600);
};