import axiosClient from './axiosClient';

export const login = (credentials) => axiosClient.post('/admin/login', credentials);
export const logout = () => axiosClient.post('/admin/logout');
export const getStats = () => axiosClient.get('/admin/stats');
export const getProfile = () => axiosClient.get('/admin/profile');
export const updateProfile = (data) => axiosClient.put('/admin/profile', data);
export const uploadProfileImage = (formData) => axiosClient.post('/admin/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadResume = (formData) => axiosClient.post('/admin/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMessages = () => axiosClient.get('/admin/messages');
export const markMessageRead = (id) => axiosClient.patch(`/admin/messages/${id}/read`);
export const deleteMessage = (id) => axiosClient.delete(`/admin/messages/${id}`);

export const getPublicProfile = () => axiosClient.get('/profile');
export const downloadResume = () => axiosClient.get('/resume/download');
