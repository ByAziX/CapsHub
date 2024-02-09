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
        
        {items.map((item, index) => (
          <Box key={index} p="4">
            <CardComponent item={item} initialIsLoading={isLoading} />
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
