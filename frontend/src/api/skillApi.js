import axiosClient from './axiosClient';

export const getSkills = () => axiosClient.get('/skills');

// Admin
export const adminGetSkills = () => axiosClient.get('/admin/skills');
export const adminCreateSkill = (data) => axiosClient.post('/admin/skills', data);
export const adminUpdateSkill = (id, data) => axiosClient.put(`/admin/skills/${id}`, data);
export const adminDeleteSkill = (id) => axiosClient.delete(`/admin/skills/${id}`);
