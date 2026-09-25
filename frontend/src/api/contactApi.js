import axiosClient from './axiosClient';

export const sendContactMessage = (data) => axiosClient.post('/contact', data);
