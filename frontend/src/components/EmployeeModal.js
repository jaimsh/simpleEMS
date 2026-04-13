import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, FormControl, FormLabel, Input,
  Select, SimpleGrid, useToast, NumberInput, NumberInputField
} from '@chakra-ui/react';
import { createEmployee, updateEmployee } from '../api';

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', department: '', position: '', salary: '', status: 'active', hire_date: '' };

function EmployeeModal({ isOpen, onClose, employee, departments, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (employee) {
      setForm({ ...employee, department: employee.department || '' });
    } else {
      setForm(EMPTY);
    }
  }, [employee, isOpen]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e }));

  const save = async () => {
    setSaving(true);
    try {
      if (employee) {
        await updateEmployee(employee.id, form);
        toast({ title: 'Employee updated', status: 'success', duration: 2000 });
      } else {
        await createEmployee(form);
        toast({ title: 'Employee added', status: 'success', duration: 2000 });
      }
      onSaved();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Save failed';
      toast({ title: msg, status: 'error', duration: 4000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{employee ? 'Edit Employee' : 'Add Employee'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input value={form.first_name} onChange={set('first_name')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input value={form.last_name} onChange={set('last_name')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={form.email} onChange={set('email')} />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input value={form.phone} onChange={set('phone')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Department</FormLabel>
              <Select placeholder="Select department" value={form.department} onChange={set('department')}>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Position</FormLabel>
              <Input value={form.position} onChange={set('position')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Salary ($)</FormLabel>
              <NumberInput value={form.salary} onChange={set('salary')} min={0}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Hire Date</FormLabel>
              <Input type="date" value={form.hire_date} onChange={set('hire_date')} />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="teal" onClick={save} isLoading={saving}>
            {employee ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EmployeeModal;
