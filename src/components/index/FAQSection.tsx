import React from 'react';
import { Box, Heading, Accordion } from '@chakra-ui/react';
import FAQItem from './FAQItem';

const FAQSection = () => (
  <Box py={10} mt={10}>
    <Heading size="lg" textAlign="center" mb={6}>FAQs</Heading>
    <Accordion allowToggle>
      <FAQItem 
        question="What is an NFT?" 
        answer="Non-Fungible Tokens (NFTs) represent ownership of unique digital items using blockchain technology." 
      />
      {/* Ajoutez d'autres FAQItem ici avec différentes questions et réponses */}
    </Accordion>
  </Box>
);

export default FAQSection;
