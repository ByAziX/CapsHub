// pages/api/collections.js

import { getCollections } from '../../services/collectionService';

// Cette fonction est le gestionnaire de votre route API pour les collections
export default async function handler(req, res) {
  // Vous pouvez ajuster ces valeurs par défaut selon vos besoins
  const limit = parseInt(req.query.limit, 10) || 6;
  const offset = parseInt(req.query.offset, 10) || 0;
  
  try {
    // Appel à votre service pour récupérer les collections
    const collections = await getCollections(limit, offset);
    // Réponse réussie avec les collections récupérées
    res.status(200).json(collections);
  } catch (error) {
    // Gestion des erreurs éventuelles
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Failed to fetch collections" });
  }
}
