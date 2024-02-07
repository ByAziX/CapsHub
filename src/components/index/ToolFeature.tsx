import React from 'react';
import { Box, Heading, Text, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ToolFeature = ({ title, icon, description }) => (
  <VStack
    as={MotionBox}
    whileHover={{ scale: 1.05 }}
    transition="all 0.3s ease-out"
    bg={useColorModeValue('white', 'gray.800')}
    p={5}
    rounded="lg"
    borderWidth="1px"
    shadow="lg"
    align="center"
    justify="center"
    // Adding a min-height to the description Text might be necessary if dynamic content is used
  >
    <Icon as={icon} w={10} h={10} color={useColorModeValue('purple.500', 'purple.200')} />
    <Heading size="md" textAlign="center">{title}</Heading>
    <Text textAlign="center" minH="4em">{description}</Text> {/* Example adjustment */}
  </VStack>
);

export default ToolFeature;
