import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Handlers
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me'); 

// Admin Endpoints
export const getSupervisors = () => API.get('/admin/supervisors');
export const addSupervisor = (formData) => API.post('/admin/supervisors', formData);

// Supervisor Endpoints
export const getAssignedStudents = () => API.get('/supervisor/students');
export const getPendingProposals = () => API.get('/supervisor/proposals');
export const reviewProposal = (id, data) => API.put(`/supervisor/proposals/${id}`, data);

// Student Endpoints
export const submitProposal = (formData) => API.post('/student/proposal', formData);
export const getStudentProposal = () => API.get('/student/proposal');
export const getStudentProgress = () => API.get('/student/progress');
export const getStudentFeedback = () => API.get('/student/feedback');

export default API;