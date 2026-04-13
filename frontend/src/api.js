import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_URL });

export const getEmployees = (params) => api.get('/employees/', { params });
export const getEmployee = (id) => api.get(`/employees/${id}/`);
export const createEmployee = (data) => api.post('/employees/', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}/`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}/`);
export const getStats = () => api.get('/employees/stats/');
export const getDepartments = () => api.get('/departments/');
export const createDepartment = (data) => api.post('/departments/', data);
