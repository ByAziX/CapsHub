import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (fetchDataFunction, limit = 24, sortBy = 'TIMESTAMP_LISTED_DESC') => {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sentinel = useRef(null);

  // Charger les données initiales
  useEffect(() => {
    setIsLoading(true);
    fetchDataFunction(limit, 0, sortBy).then(({ data, totalCount }) => {
      setItems(data);
      setTotalCount(totalCount);
      setOffset(data.length);
      setIsLoading(false);
    });
  }, [fetchDataFunction, limit, sortBy]);

  // Observer pour charger plus de données au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && items.length < totalCount && !isLoading) {
          setIsLoading(true);
          fetchDataFunction(limit, offset, sortBy).then(({ data, totalCount: newTotalCount }) => {
            setItems((prevItems) => [...prevItems, ...data]);
            setOffset((prevOffset) => prevOffset + data.length);
            setTotalCount(newTotalCount);
            setIsLoading(false);
          });
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer && observer.disconnect();
  }, [fetchDataFunction, limit, offset, items.length, isLoading, totalCount, sortBy]);

  return { items, isLoading, sentinel };
};
