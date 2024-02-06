// pages/api/profile-nfts/[profileid].tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { getNFTfromOwner } from '../../../services/nftService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { profileid, limit = '24', offset = '0', sortBy = 'TIMESTAMP_LISTED_DESC' },
  } = req;

  const limitNum = parseInt(limit as string, 10);
  const offsetNum = parseInt(offset as string, 10);

  try {
    if (typeof profileid === 'string') {
      const { nfts, totalCount } = await getNFTfromOwner(profileid, limitNum, offsetNum, sortBy as string);
      res.status(200).json({ nfts, totalCount });
    } else {
      throw new Error('Profile ID must be a string');
    }
  } catch (error) {
    console.error('Error fetching NFTs for profile:', error);
    res.status(500).json({ message: 'Failed to fetch NFTs for profile' });
  }
}
