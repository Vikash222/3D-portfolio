import axiosClient from './axiosClient';

// --- AUTH & USER ---
export const login = (credentials) => axiosClient.post('/admin/login', credentials);
export const logout = () => axiosClient.post('/admin/logout');
export const getAdminMe = () => axiosClient.get('/admin/me');
export const getAdminUsers = () => axiosClient.get('/admin/users');
export const updateAdminUserRole = (id, role) => axiosClient.patch(`/admin/users/${id}/role`, { role });
export const updateAdminAccount = (data) => axiosClient.put('/admin/account', data);

// --- DASHBOARD & ANALYTICS ---
export const getStats = () => axiosClient.get('/admin/stats');
export const getAnalytics = () => axiosClient.get('/admin/analytics');
export const globalSearch = (q) => axiosClient.get('/admin/search', { params: { q } });
export const exportBackup = () => axiosClient.get('/admin/backup/export');
export const restoreBackup = (data) => axiosClient.post('/admin/backup/restore', { backup_data: data });
export const getActivityLogs = () => axiosClient.get('/admin/activity-logs');

// --- NOTIFICATIONS ---
export const getNotifications = () => axiosClient.get('/admin/notifications');
export const markNotificationRead = (id) => axiosClient.patch(`/admin/notifications/${id}/read`);
export const markAllNotificationsRead = () => axiosClient.post('/admin/notifications/read-all');

// --- PROFILE & GLOBAL SETTINGS ---
export const getProfile = () => axiosClient.get('/admin/profile');
export const updateProfile = (data) => axiosClient.put('/admin/profile', data);
export const uploadProfileImage = (formData) => axiosClient.post('/admin/profile/image', formData);
export const uploadResume = (formData) => axiosClient.post('/admin/profile/resume', formData);

// --- PROJECTS ---
export const adminGetProjects = (params) => axiosClient.get('/admin/projects', { params });
export const adminCreateProject = (data) => axiosClient.post('/admin/projects', data);
export const adminUpdateProject = (id, data) => axiosClient.put(`/admin/projects/${id}`, data);
export const adminDeleteProject = (id) => axiosClient.delete(`/admin/projects/${id}`);
export const adminTogglePin = (id) => axiosClient.patch(`/admin/projects/${id}/pin`);
export const adminUpdateOrder = (id, order) => axiosClient.patch(`/admin/projects/${id}/order`, { display_order: order });
export const adminUpdateProjectStatus = (id, status) => axiosClient.patch(`/admin/projects/${id}/status`, { status });

// --- SKILLS ---
export const adminGetSkills = () => axiosClient.get('/admin/skills');
export const adminCreateSkill = (data) => axiosClient.post('/admin/skills', data);
export const adminUpdateSkill = (id, data) => axiosClient.put(`/admin/skills/${id}`, data);
export const adminDeleteSkill = (id) => axiosClient.delete(`/admin/skills/${id}`);
export const adminUpdateSkillOrder = (id, order) => axiosClient.patch(`/admin/skills/${id}/order`, { display_order: order });
export const adminToggleSkill = (id) => axiosClient.patch(`/admin/skills/${id}/toggle`);

// --- EXPERIENCES ---
export const adminGetExperiences = () => axiosClient.get('/admin/experiences');
export const adminCreateExperience = (data) => axiosClient.post('/admin/experiences', data);
export const adminUpdateExperience = (id, data) => axiosClient.put(`/admin/experiences/${id}`, data);
export const adminDeleteExperience = (id) => axiosClient.delete(`/admin/experiences/${id}`);

// --- EDUCATIONS ---
export const adminGetEducations = () => axiosClient.get('/admin/educations');
export const adminCreateEducation = (data) => axiosClient.post('/admin/educations', data);
export const adminUpdateEducation = (id, data) => axiosClient.put(`/admin/educations/${id}`, data);
export const adminDeleteEducation = (id) => axiosClient.delete(`/admin/educations/${id}`);

// --- CERTIFICATES ---
export const adminGetCertificates = () => axiosClient.get('/admin/certificates');
export const adminCreateCertificate = (data) => axiosClient.post('/admin/certificates', data);
export const adminUpdateCertificate = (id, data) => axiosClient.put(`/admin/certificates/${id}`, data);
export const adminDeleteCertificate = (id) => axiosClient.delete(`/admin/certificates/${id}`);

// --- ACHIEVEMENTS ---
export const adminGetAchievements = () => axiosClient.get('/admin/achievements');
export const adminCreateAchievement = (data) => axiosClient.post('/admin/achievements', data);
export const adminUpdateAchievement = (id, data) => axiosClient.put(`/admin/achievements/${id}`, data);
export const adminDeleteAchievement = (id) => axiosClient.delete(`/admin/achievements/${id}`);

// --- TESTIMONIALS / REVIEWS ---
export const adminGetTestimonials = () => axiosClient.get('/admin/testimonials');
export const adminCreateTestimonial = (data) => axiosClient.post('/admin/testimonials', data);
export const adminUpdateTestimonial = (id, data) => axiosClient.put(`/admin/testimonials/${id}`, data);
export const adminDeleteTestimonial = (id) => axiosClient.delete(`/admin/testimonials/${id}`);
export const adminToggleApproveTestimonial = (id) => axiosClient.patch(`/admin/testimonials/${id}/approve`);
export const adminToggleFeatureTestimonial = (id) => axiosClient.patch(`/admin/testimonials/${id}/feature`);

// --- BLOGS ---
export const adminGetBlogs = () => axiosClient.get('/admin/blogs');
export const adminCreateBlog = (data) => axiosClient.post('/admin/blogs', data);
export const adminUpdateBlog = (id, data) => axiosClient.put(`/admin/blogs/${id}`, data);
export const adminDeleteBlog = (id) => axiosClient.delete(`/admin/blogs/${id}`);

// --- SOCIALS ---
export const adminGetSocials = () => axiosClient.get('/admin/socials');
export const adminCreateSocial = (data) => axiosClient.post('/admin/socials', data);
export const adminUpdateSocial = (id, data) => axiosClient.put(`/admin/socials/${id}`, data);
export const adminDeleteSocial = (id) => axiosClient.delete(`/admin/socials/${id}`);

// --- NAVIGATION ---
export const adminGetNavigation = () => axiosClient.get('/admin/navigation');
export const adminCreateNavigation = (data) => axiosClient.post('/admin/navigation', data);
export const adminUpdateNavigation = (id, data) => axiosClient.put(`/admin/navigation/${id}`, data);
export const adminDeleteNavigation = (id) => axiosClient.delete(`/admin/navigation/${id}`);

// --- MEDIA ---
export const adminGetMedia = () => axiosClient.get('/admin/media');
export const adminUploadMedia = (formData) => axiosClient.post('/admin/media/upload', formData);
export const adminDeleteMedia = (id) => axiosClient.delete(`/admin/media/${id}`);

// --- MESSAGES / INBOX ---
export const getMessages = (params) => axiosClient.get('/admin/messages', { params });
export const markMessageRead = (id) => axiosClient.patch(`/admin/messages/${id}/read`);
export const updateMessageStatus = (id, status) => axiosClient.patch(`/admin/messages/${id}/status`, { status });
export const replyMessage = (id, replyContent) => axiosClient.post(`/admin/messages/${id}/reply`, { reply_content: replyContent });
export const deleteMessage = (id) => axiosClient.delete(`/admin/messages/${id}`);
export const exportMessages = () => axiosClient.get('/admin/messages/export');

// --- PUBLIC PORTFOLIO ---
export const getPortfolio = () => axiosClient.get('/portfolio');
export const trackEvent = (data) => axiosClient.post('/analytics/event', data);
export const trackSocialClick = (id) => axiosClient.post(`/socials/${id}/click`);
export const submitReview = (data) => axiosClient.post('/testimonials', data);
export const getPublicProfile = () => axiosClient.get('/profile');
export const downloadResume = () => axiosClient.get('/resume/download');
