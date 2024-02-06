// pages/api/nfts.js
import { getLastListedNFTs } from '../../services/nftService';

export default async function handler(req, res) {
  const limit = parseInt(req.query.limit, 10) || 24;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sortBy = req.query.sortBy || 'TIMESTAMP_LISTED_DESC';

  try {
    const { nfts, totalCount } = await getLastListedNFTs(limit, offset, sortBy);
    res.status(200).json({ nfts, totalCount });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ message: "Failed to fetch NFTs" });
  }
}
