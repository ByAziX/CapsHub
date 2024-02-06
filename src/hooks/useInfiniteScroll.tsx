import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { NFTEntity } from '../interfaces/interfaces';


interface UseInfiniteScrollProps {
  isLoading: boolean;
  totalCount: number;
  loadedNfts: NFTEntity[];
  setLoadedNfts: Dispatch<SetStateAction<NFTEntity[]>>;
  setOffset: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  sortBy: string;
  DEFAULT_LIMIT: number;
}

const useInfiniteScroll = ({
  isLoading,
  totalCount,
  loadedNfts,
  setLoadedNfts,
  setOffset,
  setIsLoading, // Ajout de setIsLoading ici
  sortBy,
  DEFAULT_LIMIT
}: UseInfiniteScrollProps) => {
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedNfts.length < totalCount && !isLoading) {
          setIsLoading(true); // Utilisation correcte de setIsLoading
          fetch(`/api/nfts?limit=${DEFAULT_LIMIT}&offset=${loadedNfts.length}&sortBy=${sortBy}`)
            .then((res) => res.json())
            .then((data) => {
              setLoadedNfts((prev) => [...prev, ...data.nfts]);
              setOffset((prevOffset) => prevOffset + DEFAULT_LIMIT);
            })
            .finally(() => setIsLoading(false)); // Assurez-vous d'arrêter le chargement une fois terminé
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => {
      if (sentinel.current) {
        observer.unobserve(sentinel.current);
      }
    };
  }, [isLoading, totalCount, loadedNfts.length, setLoadedNfts, setOffset, setIsLoading, sortBy, DEFAULT_LIMIT]);

  return sentinel;
};

export default useInfiniteScroll;
