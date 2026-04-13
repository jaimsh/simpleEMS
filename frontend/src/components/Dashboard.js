import React, { useEffect, useState } from 'react';
import {
  Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Heading, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td,
  useColorModeValue, Card, CardBody, CardHeader
} from '@chakra-ui/react';
import { getStats } from '../api';

function StatCard({ label, value, helpText, color }) {
  const bg = useColorModeValue('white', 'gray.700');
  return (
    <Card bg={bg} boxShadow="sm">
      <CardBody>
        <Stat>
          <StatLabel color="gray.500">{label}</StatLabel>
          <StatNumber color={color} fontSize="3xl">{value}</StatNumber>
          {helpText && <StatHelpText>{helpText}</StatHelpText>}
        </Stat>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load stats. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box py={10} textAlign="center"><Spinner size="xl" color="teal.500" /></Box>;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={4} color="teal.600">Overview</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={8}>
        <StatCard label="Total Employees" value={stats.total} color="teal.600" />
        <StatCard label="Active" value={stats.active} color="green.500" />
        <StatCard label="On Leave" value={stats.on_leave} color="orange.400" />
        <StatCard label="Inactive" value={stats.inactive} color="red.400" />
      </SimpleGrid>

      <Card bg={bg} boxShadow="sm">
        <CardHeader pb={0}>
          <Heading size="sm" color="gray.600">Employees by Department</Heading>
        </CardHeader>
        <CardBody>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Department</Th>
                <Th isNumeric>Employees</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stats.by_department.map(d => (
                <Tr key={d.name}>
                  <Td>{d.name}</Td>
                  <Td isNumeric>{d.count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Dashboard;
