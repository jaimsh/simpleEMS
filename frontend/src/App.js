import React from 'react';
import {
  Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs,
  useColorModeValue, Container, Flex, Icon
} from '@chakra-ui/react';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import { FiUsers, FiBarChart2 } from 'react-icons/fi';

function App() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('teal.600', 'teal.800');

  return (
    <Box minH="100vh" bg={bg}>
      <Box bg={headerBg} color="white" px={6} py={4} mb={6} boxShadow="md">
        <Heading size="lg">SimpleEMS — Employee Management System</Heading>
      </Box>
      <Container maxW="container.xl">
        <Tabs colorScheme="teal" variant="enclosed">
          <TabList>
            <Tab><Flex align="center" gap={2}><Icon as={FiBarChart2} />Dashboard</Flex></Tab>
            <Tab><Flex align="center" gap={2}><Icon as={FiUsers} />Employees</Flex></Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Dashboard /></TabPanel>
            <TabPanel><EmployeeList /></TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default App;
