import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement,
  Select, Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton,
  useDisclosure, Spinner, Alert, AlertIcon, useToast,
  useColorModeValue, Text
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getEmployees, getDepartments, deleteEmployee } from '../api';
import EmployeeModal from './EmployeeModal';

const STATUS_COLORS = { active: 'green', inactive: 'red', on_leave: 'orange' };

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.700');

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (deptFilter) params.department = deptFilter;
    getEmployees(params)
      .then(res => setEmployees(res.data.results || res.data))
      .catch(() => setError('Failed to load employees.'))
      .finally(() => setLoading(false));
  }, [search, statusFilter, deptFilter]);

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data.results || res.data));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    await deleteEmployee(id);
    toast({ title: `${name} deleted`, status: 'info', duration: 2000 });
    load();
  };

  const handleEdit = (emp) => { setSelected(emp); onOpen(); };
  const handleAdd = () => { setSelected(null); onOpen(); };
  const handleSaved = () => { onClose(); load(); };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color="teal.600">Employees</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="teal" size="sm" onClick={handleAdd}>
          Add Employee
        </Button>
      </Flex>

      <Flex gap={3} mb={4} flexWrap="wrap">
        <InputGroup maxW="300px">
          <InputLeftElement><FiSearch color="gray" /></InputLeftElement>
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </InputGroup>
        <Select placeholder="All Statuses" maxW="160px" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </Select>
        <Select placeholder="All Departments" maxW="200px" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
      </Flex>

      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}

      {loading ? (
        <Box py={10} textAlign="center"><Spinner color="teal.500" /></Box>
      ) : employees.length === 0 ? (
        <Box py={10} textAlign="center"><Text color="gray.400">No employees found.</Text></Box>
      ) : (
        <Box bg={bg} boxShadow="sm" borderRadius="md" overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.600')}>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Department</Th>
                <Th>Position</Th>
                <Th isNumeric>Salary</Th>
                <Th>Status</Th>
                <Th>Hire Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.map(emp => (
                <Tr key={emp.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}>
                  <Td fontWeight="medium">{emp.full_name}</Td>
                  <Td color="gray.500" fontSize="sm">{emp.email}</Td>
                  <Td>{emp.department_name || '—'}</Td>
                  <Td>{emp.position}</Td>
                  <Td isNumeric>${Number(emp.salary).toLocaleString()}</Td>
                  <Td><Badge colorScheme={STATUS_COLORS[emp.status]}>{emp.status.replace('_', ' ')}</Badge></Td>
                  <Td color="gray.500" fontSize="sm">{emp.hire_date}</Td>
                  <Td>
                    <Flex gap={1}>
                      <IconButton size="xs" icon={<FiEdit2 />} aria-label="edit" variant="ghost" colorScheme="teal" onClick={() => handleEdit(emp)} />
                      <IconButton size="xs" icon={<FiTrash2 />} aria-label="delete" variant="ghost" colorScheme="red" onClick={() => handleDelete(emp.id, emp.full_name)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <EmployeeModal isOpen={isOpen} onClose={onClose} employee={selected} departments={departments} onSaved={handleSaved} />
    </Box>
  );
}

export default EmployeeList;
