import axiosClient from './axiosClient';

export const getProjects = (tag) => axiosClient.get('/projects', { params: tag ? { tag } : {} });
export const getProject = (id) => axiosClient.get(`/projects/${id}`);

// Admin
export const adminGetProjects = () => axiosClient.get('/admin/projects');
export const adminCreateProject = (data) => axiosClient.post('/admin/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateProject = (id, data) => axiosClient.put(`/admin/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteProject = (id) => axiosClient.delete(`/admin/projects/${id}`);
export const adminTogglePin = (id) => axiosClient.patch(`/admin/projects/${id}/pin`);
export const adminUpdateOrder = (id, order) => axiosClient.patch(`/admin/projects/${id}/order`, { display_order: order });
