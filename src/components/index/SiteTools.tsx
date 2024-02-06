import React from 'react';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';
import { FaChartLine, FaCoins, FaUserShield } from 'react-icons/fa';
import ToolFeature from './ToolFeature';

const SiteTools = () => (
  <Box py={10}>
    <Heading size="lg" textAlign="center" my={10}>
      Tools Available
    </Heading>
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
    <ToolFeature
        title="Sentinel Battle Delegation"
        icon={FaUserShield} // Assurez-vous d'importer FaUserShield de react-icons/fa
        description="Delegate your sentinels to participate in battles, earning rewards and enhancing your strategic position."
        />
    <ToolFeature
        title="Node Rental"
        icon={FaCoins}
        description="Rent sentinel nodes to increase your network presence and earn passive income through system rewards."
      />
      <ToolFeature
        title="Market Analytics"
        icon={FaChartLine}
        description="Access comprehensive market analytics to make informed decisions and optimize your sentinel deployments."
      />
    </SimpleGrid>
  </Box>
);

export default SiteTools;
