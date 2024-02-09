interface AuctionEntity {

  }

export interface metadata {
  title: string;
  description: string;
  image: string;
  properties: {
    media: {
      hash: string;
      type: string;
      size: number;
    }
  }
}

export interface CollectionEntity {

    collectionId: string;
    owner: string | null;
    offchainData: string;
    nfts: string[];
    nbNfts: number;
    limit: number | null;
    hasReachedLimit: boolean;
    isClosed: boolean;
    timestampCreated: Date;
    timestampBurned: Date | null;
    timestampClosed: Date | null;
    timestampLimited: Date | null;
    name: string;
    description: string;
    banner_image: string;
    profile_image: string;
    bannerUrl: string;
    profileUrl: string;
    profile_image_file:{
      hash: string;
      type: string;
      size: number;
    }


  }
  
  interface RentEntity {
    // Define properties of RentEntity
  }
  
  interface MarketplaceEntity {
    // Define properties of MarketplaceEntity
  }
  
  interface TransmissionEntity {
    // Define properties of TransmissionEntity
  }
  
export interface NFTResponse {
    nftEntities: {
      totalCount: number;
      nodes: NFTEntity[];
    };
  }

export interface CollectionResponse {
  collectionEntities: {
      totalCount: number;
      nodes: CollectionEntity[];
    };
  }


export interface NFTEntity {
    nftId: string;
    auction: AuctionEntity | null;
    collection: CollectionEntity | null;
    owner: string | null;
    creator: string;
    delegatee: string | null;
    royalty: number;
    offchainData: string;
    secretOffchainData: string | null;
    capsuleOffchainData: string | null;
    isCapsule: boolean;
    isCapsuleSynced: boolean;
    isSecret: boolean;
    isSecretSynced: boolean;
    isDelegated: boolean;
    isTransmission: boolean;
    isSoulbound: boolean;
    isListed: boolean;
    isRented: boolean;
    rentee: string | null;
    rentalContract: RentEntity | null;
    price: string | null;
    priceRounded: number | null;
    marketplace: MarketplaceEntity | null;
    typeOfListing: string | null;
    transmissionRecipient: string | null;
    transmissionProtocol: TransmissionEntity | null;
    timestampCreated: Date;
    timestampBurned: Date | null;
    timestampListed: Date | null;
    timestampRented: Date | null;
    timestampSecretAdded: Date | null;
    timestampConvertedToCapsule: Date | null;
    metadata?: metadata;
    mediaUrl: string | null;
  }
  

export interface NFTListProps {
    nfts: NFTEntity[];
    totalCount: number;
    sortBy : string;
    isLoading: boolean;
  }

export interface CollectionListProps {
    collections: CollectionEntity[];
    totalCount: number;
    isLoading: boolean;
  }

export interface IndexPageProps {
    nfts: NFTEntity[];
    last_nft: NFTEntity;
    collections: CollectionEntity[];
  }

  export interface CollectionPageProps {
    collection: CollectionEntity;
    totalCount: number;
    nfts: NFTEntity[];

  }



  