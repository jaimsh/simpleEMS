import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Spinner,
  HStack,
  IconButton,
  Tooltip,
  useToast,
  keyframes,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import api from '../services/api';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    activeEmployees: 0,
    recentHires: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  const fetchDashboardData = useCallback(async ({ showRefreshFeedback = false } = {}) => {
    if (showRefreshFeedback) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [employeesRes, departmentsRes] = await Promise.all([
        api.get('/api/employees/'),
        api.get('/api/departments/'),
      ]);

      const employees = Array.isArray(employeesRes.data)
        ? employeesRes.data
        : employeesRes.data.results || [];
      const depts = Array.isArray(departmentsRes.data)
        ? departmentsRes.data
        : departmentsRes.data.results || [];

      const activeCount = employees.filter(
        (emp) => emp.status === 'Active' || emp.is_active === true || emp.status === 'active'
      ).length;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentHireCount = employees.filter((emp) => {
        const hireDate = new Date(emp.hire_date || emp.date_joined || emp.created_at);
        return hireDate >= thirtyDaysAgo;
      }).length;

      setStats({
        totalEmployees: employees.length,
        totalDepartments: depts.length,
        activeEmployees: activeCount,
        recentHires: recentHireCount,
      });

      const sortedEmployees = [...employees]
        .sort((a, b) => {
          const dateA = new Date(a.hire_date || a.date_joined || a.created_at || 0);
          const dateB = new Date(b.hire_date || b.date_joined || b.created_at || 0);
          return dateB - dateA;
        })
        .slice(0, 5);

      setRecentEmployees(sortedEmployees);
      setDepartments(depts);

      if (showRefreshFeedback) {
        toast({
          title: 'Dashboard refreshed',
          description: 'All dashboard data has been updated.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Refresh failed',
        description:
          error?.response?.data?.detail ||
          error?.message ||
          'Failed to fetch dashboard data. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    if (isRefreshing) return;
    fetchDashboardData({ showRefreshFeedback: true });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack spacing={3} mb={6} alignItems="center">
        <Heading size="lg">Dashboard</Heading>
        <Tooltip label="Refresh Dashboard" hasArrow placement="right">
          <IconButton
            aria-label="Refresh Dashboard"
            icon={
              <RepeatIcon
                animation={isRefreshing ? `${spin} 1s linear infinite` : undefined}
              />
            }
            onClick={handleRefresh}
            isLoading={false}
            isDisabled={isRefreshing}
            variant="ghost"
            colorScheme="blue"
            size="md"
            borderRadius="full"
            _hover={{ bg: 'blue.50' }}
            _active={{ bg: 'blue.100' }}
          />
        </Tooltip>
      </HStack>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Employees</StatLabel>
              <StatNumber color="blue.600">{stats.totalEmployees}</StatNumber>
              <StatHelpText>All registered employees</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Employees</StatLabel>
              <StatNumber color="green.600">{stats.activeEmployees}</StatNumber>
              <StatHelpText>Currently active</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Departments</StatLabel>
              <StatNumber color="purple.600">{stats.totalDepartments}</StatNumber>
              <StatHelpText>Total departments</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Recent Hires</StatLabel>
              <StatNumber color="orange.600">{stats.recentHires}</StatNumber>
              <StatHelpText>Last 30 days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Employees and Department Overview */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Employees</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {recentEmployees.length === 0 ? (
              <Text color="gray.500">No employees found.</Text>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Department</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentEmployees.map((emp) => (
                      <Tr key={emp.id}>
                        <Td>
                          {emp.first_name} {emp.last_name}
                        </Td>
                        <Td>{emp.department_name || emp.department?.name || 'N/A'}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              emp.status === 'Active' ||
                              emp.status === 'active' ||
                              emp.is_active
                                ? 'green'
                                : 'red'
                            }
                          >
                            {emp.status || (emp.is_active ? 'Active' : 'Inactive')}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <Heading size="md">Department Overview</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {departments.length === 0 ? (
              <Text color="gray.500">No departments found.</Text>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Department</Th>
                      <Th isNumeric>Employees</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {departments.map((dept) => (
                      <Tr key={dept.id}>
                        <Td>{dept.name}</Td>
                        <Td isNumeric>
                          {dept.employee_count ?? dept.employees_count ?? dept.num_employees ?? '—'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
