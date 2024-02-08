import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Flex, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Carousel = ({ items, CardComponent, isLoading }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 0);

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    checkScrollButtons();
    const scrollElement = scrollRef.current;
    scrollElement.addEventListener('scroll', checkScrollButtons, { passive: true });

    return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
  }, [items.length]);

  const scroll = (direction) => {
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const renderSkeletons = () => (
    Array.from({ length: items.length || 5 }).map((_, index) => (
      <Box key={index} p="4" borderWidth="1px" borderRadius="lg" margin={4} overflow="hidden" width="220px" height="340px">
      <Skeleton height="160px" />
      <SkeletonText mt="4" noOfLines={1} />
      <Skeleton mt="4" height="20px" width="80%" />
      <Skeleton mt="2" height="20px" width="60%" />
    </Box>
      
    ))
  );

  return (
    <Flex alignItems="center" justifyContent="center" position="relative" w="full">
      <IconButton
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        icon={<ChevronLeftIcon />}
        isDisabled={!canScrollLeft}
        position="absolute"
        left={0}
        zIndex={2}
        bg="transparent"
      />
      <Box
        ref={scrollRef}
        display="flex"
        overflowX="auto"
        w="full"
        p={2}
        scrollBehavior="smooth"
      >
        {isLoading ? renderSkeletons() : items.map((item, index) => (
          <Box p="4">
            <CardComponent key={index} item={item} />
          </Box>
        ))}
      </Box>
      <IconButton
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        icon={<ChevronRightIcon />}
        isDisabled={!canScrollRight}
        position="absolute"
        right={0}
        zIndex={2}
        bg="transparent"
      />
    </Flex>
  );
};

export default Carousel;
