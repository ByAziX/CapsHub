import React from 'react';
import { AccordionItem, AccordionButton, Box, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const FAQItem = ({ question, answer }) => (
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          {question}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      {answer}
    </AccordionPanel>
  </AccordionItem>
);

export default FAQItem;
