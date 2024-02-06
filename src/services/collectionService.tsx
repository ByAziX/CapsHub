// nftService.tsx
import { request, gql } from 'graphql-request';
import { TernoaIPFS } from 'ternoa-js';
import cache from './redisClient'; 
import { CollectionEntity, CollectionResponse } from '../interfaces/interfaces';

const ipfsClient = new TernoaIPFS(new URL(process.env.IPFS_GATEWAY!), process.env.IPFS_API_KEY);


const fetchIPFSMetadataCollection = async (offchainData: string): Promise<{ metadata: any; bannerUrl: string, profileUrl: string }> => {
    const defaultBannerHash = "Qm..."; // Remplacez par un hash IPFS par défaut pour la bannière
    const defaultProfileHash = "Qm..."; // Remplacez par un hash IPFS par défaut pour l'image de profil
    const cacheKey = `ipfs:collection:${offchainData}`;
    const cachedData = await cache.get(cacheKey);
  
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    try {
      const metadata = await ipfsClient.getFile(offchainData) as any;
      const bannerUrl = metadata?.banner_image
        ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.banner_image}`
        : `${process.env.IPFS_GATEWAY}/ipfs/${defaultBannerHash}`;
      const profileUrl = metadata?.profile_image
        ? `${process.env.IPFS_GATEWAY}/ipfs/${metadata.profile_image}`
        : `${process.env.IPFS_GATEWAY}/ipfs/${defaultProfileHash}`;
  
      // Stocker dans le cache
      const cacheValue = JSON.stringify({ metadata, bannerUrl, profileUrl });
      await cache.set(cacheKey, cacheValue, 10000);
  
      return { metadata, bannerUrl, profileUrl };
    } catch (error) {
      console.error(`Error fetching collection metadata from IPFS:`, error);
      // Utiliser les images par défaut en cas d'échec de la récupération des données IPFS
      return {
        metadata: null,
        bannerUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultBannerHash}`,
        profileUrl: `${process.env.IPFS_GATEWAY}/ipfs/${defaultProfileHash}`
      };
    }
  };

export const getCollections = async (limit = 10, offset = 0): Promise<{ collections: CollectionEntity[], totalCount: number }> => {
    const cacheKey = `collections:${limit}:${offset}`;
    const cachedData = await cache.get(cacheKey);
  
    if (cachedData) return JSON.parse(cachedData);
  
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
  
    try {
      const response = await request<CollectionResponse>(process.env.GRAPHQL_ENDPOINT!, gqlQuery, {
        first: limit,
        offset
      });
  
      const collections = await Promise.all(response.collectionEntities.nodes.map(async (collection) => {
        const { metadata, bannerUrl, profileUrl } = await fetchIPFSMetadataCollection(collection.offchainData);
        return { ...collection, ...metadata, bannerUrl, profileUrl };
      }));
  
      await cache.set(cacheKey, JSON.stringify({ collections, totalCount: response.collectionEntities.totalCount }), 10);
  
      return { collections, totalCount: response.collectionEntities.totalCount };
    } catch (error) {
      console.error('Error fetching NFT collections:', error);
      throw new Error('Error fetching NFT collections');
    }
  };


export const getCollectionFromID = async (collectionID: string): Promise<{ collection: CollectionEntity}> => {
    const cacheKey = `collections:${collectionID}`;
    const cachedData = await cache.get(cacheKey);
  
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
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
  
    try {
      const response = await request<CollectionResponse>(process.env.GRAPHQL_ENDPOINT!, gqlQuery, {
        collectionID
      });
  
      if (response.collectionEntities.nodes.length > 0) {
        // Assuming only one collection is returned for a given ID
        const collection = response.collectionEntities.nodes[0];
        const { metadata, bannerUrl, profileUrl } = await fetchIPFSMetadataCollection(collection.offchainData);
        
        const enrichedCollection = { ...collection, ...metadata, bannerUrl, profileUrl };
  
        await cache.set(cacheKey, JSON.stringify({ collection: enrichedCollection }), 10);
        return { collection: enrichedCollection };
      }
  
      throw new Error('Collection not found');
    } catch (error) {
      console.error("Error fetching collection details:", error);
      throw error; // Re-throw the error or handle it as needed
    }
  };