import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://vikash-backend.onrender.com/api' : '/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Sanctum Bearer Token cleanly based on route type (Admin vs Client)
api.interceptors.request.use((config) => {
  const url = config.url || '';
  let token = null;

  if (url.includes('/client/')) {
    token = localStorage.getItem('portfolio_client_token') || localStorage.getItem('portfolio_admin_token');
  } else if (url.includes('/admin/')) {
    token = localStorage.getItem('portfolio_admin_token');
  } else {
    // For shared routes
    token = localStorage.getItem('portfolio_admin_token') || localStorage.getItem('portfolio_client_token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      if (url.includes('/admin/')) {
        localStorage.removeItem('portfolio_admin_token');
        localStorage.removeItem('portfolio_admin_user');
      } else if (url.includes('/client/')) {
        localStorage.removeItem('portfolio_client_token');
        localStorage.removeItem('portfolio_client_user');
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   Public Portfolio API
   ========================================================================== */
export const getPortfolioData = async () => {
  const res = await api.get('/portfolio');
  return res.data;
};

export const submitContactForm = async (payload) => {
  const res = await api.post('/contact', payload);
  return res.data;
};

/* ==========================================================================
   Chat With Vikash AI Assistant (Gemini API)
   ========================================================================== */
export const chatWithAi = async (message, history = []) => {
  const res = await api.post('/chat/assistant', { message, history });
  return res.data;
};

/* ==========================================================================
   Auth & Client Registration API
   ========================================================================== */
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerClient = async (name, email, password, phone = '') => {
  const res = await api.post('/auth/register', { name, email, password, phone });
  return res.data;
};

export const googleAuthClient = async (payload) => {
  const res = await api.post('/auth/google', payload);
  return res.data;
};

export const microsoftAuthClient = async (payload) => {
  const res = await api.post('/auth/microsoft', payload);
  return res.data;
};

export const verify2Fa = async (challenge_token, code) => {
  const res = await api.post('/auth/2fa/verify', { challenge_token, code });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const getClientInquiries = async () => {
  const res = await api.get('/client/inquiries');
  return res.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('portfolio_admin_user');
    localStorage.removeItem('portfolio_client_token');
    localStorage.removeItem('portfolio_client_user');
  }
};

/* ==========================================================================
   File Upload API (Images, Snaps & Resume PDF)
   ========================================================================== */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

/* ==========================================================================
   2FA Configuration API (Microsoft Authenticator)
   ========================================================================== */
export const setup2Fa = async () => {
  const res = await api.post('/admin/2fa/setup');
  return res.data;
};

export const confirm2Fa = async (code) => {
  const res = await api.post('/admin/2fa/confirm', { code });
  return res.data;
};

export const disable2Fa = async (password) => {
  const res = await api.post('/admin/2fa/disable', { password });
  return res.data;
};

export const regenerateRecoveryCodes = async () => {
  const res = await api.post('/admin/2fa/recovery-codes');
  return res.data;
};

/* ==========================================================================
   Admin Dashboard & Messages
   ========================================================================== */
export const getDashboardStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getMessages = async (filter = 'all', search = '') => {
  const res = await api.get('/admin/messages', {
    params: { filter, search },
  });
  return res.data;
};

export const getMessage = async (id) => {
  const res = await api.get(`/admin/messages/${id}`);
  return res.data;
};

export const toggleMessageRead = async (id) => {
  const res = await api.patch(`/admin/messages/${id}/toggle-read`);
  return res.data;
};

export const updateMessageStatus = async (id, status) => {
  const res = await api.patch(`/admin/messages/${id}/status`, { status });
  return res.data;
};

export const deleteMessage = async (id) => {
  const res = await api.delete(`/admin/messages/${id}`);
  return res.data;
};

/* ==========================================================================
   Admin Content Management (Projects, Skills, Experience, Services, Testimonials, Profile)
   ========================================================================== */
export const getProjects = async () => {
  const res = await api.get('/admin/projects');
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post('/admin/projects', data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/admin/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/admin/projects/${id}`);
  return res.data;
};

export const getSkills = async () => {
  const res = await api.get('/admin/skills');
  return res.data;
};

export const createSkill = async (data) => {
  const res = await api.post('/admin/skills', data);
  return res.data;
};

export const updateSkill = async (id, data) => {
  const res = await api.put(`/admin/skills/${id}`, data);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await api.delete(`/admin/skills/${id}`);
  return res.data;
};

export const getExperiences = async () => {
  const res = await api.get('/admin/experience');
  return res.data;
};

export const createExperience = async (data) => {
  const res = await api.post('/admin/experience', data);
  return res.data;
};

export const updateExperience = async (id, data) => {
  const res = await api.put(`/admin/experience/${id}`, data);
  return res.data;
};

export const deleteExperience = async (id) => {
  const res = await api.delete(`/admin/experience/${id}`);
  return res.data;
};

export const getServices = async () => {
  const res = await api.get('/admin/services');
  return res.data;
};

export const createService = async (data) => {
  const res = await api.post('/admin/services', data);
  return res.data;
};

export const updateService = async (id, data) => {
  const res = await api.put(`/admin/services/${id}`, data);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/admin/services/${id}`);
  return res.data;
};

export const getTestimonials = async () => {
  const res = await api.get('/admin/testimonials');
  return res.data;
};

export const createTestimonial = async (data) => {
  const res = await api.post('/admin/testimonials', data);
  return res.data;
};

export const updateTestimonial = async (id, data) => {
  const res = await api.put(`/admin/testimonials/${id}`, data);
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await api.delete(`/admin/testimonials/${id}`);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await api.get('/admin/profile');
  return res.data;
};

export const updateAdminProfile = async (data) => {
  const res = await api.put('/admin/profile', data);
  return res.data;
};

export const getAiSettings = async () => {
  const res = await api.get('/admin/ai-settings');
  return res.data;
};

export const updateAiSettings = async (data) => {
  const res = await api.put('/admin/ai-settings', data);
  return res.data;
};

export const testAiConnection = async (apiKey = '') => {
  const res = await api.post('/admin/ai-settings/test', { api_key: apiKey });
  return res.data;
};

/* ==========================================================================
   Live Social Media & Activity Stream API
   ========================================================================== */
export const getSocialFeed = async () => {
  const res = await api.get('/social-feed');
  return res.data;
};

export const getAdminSocialPosts = async () => {
  const res = await api.get('/admin/social-posts');
  return res.data;
};

export const createAdminSocialPost = async (data) => {
  const res = await api.post('/admin/social-posts', data);
  return res.data;
};

export const updateAdminSocialPost = async (id, data) => {
  const res = await api.put(`/admin/social-posts/${id}`, data);
  return res.data;
};

export const deleteAdminSocialPost = async (id) => {
  const res = await api.delete(`/admin/social-posts/${id}`);
  return res.data;
};

export const togglePinAdminSocialPost = async (id) => {
  const res = await api.patch(`/admin/social-posts/${id}/toggle-pin`);
  return res.data;
};

/* ==========================================================================
   Client Live 1-on-1 Chat, Project Builder & Razorpay Payments
   ========================================================================== */
export const getPricingPackages = async () => {
  const res = await api.get('/pricing-packages');
  return res.data;
};

export const getClientConversation = async () => {
  const res = await api.get('/client/conversation');
  return res.data;
};

export const sendClientMessage = async (message, attachment_url = null) => {
  const res = await api.post('/client/conversation/message', { message, attachment_url });
  return res.data;
};

export const markClientConversationRead = async () => {
  const res = await api.post('/client/conversation/mark-read');
  return res.data;
};

export const getClientProjectRequests = async () => {
  const res = await api.get('/client/project-requests');
  return res.data;
};

export const createClientProjectRequest = async (data) => {
  const res = await api.post('/client/project-requests', data);
  return res.data;
};

export const createPaymentOrder = async (data) => {
  const res = await api.post('/client/payment/order', data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await api.post('/client/payment/verify', data);
  return res.data;
};

export const getClientPayments = async () => {
  const res = await api.get('/client/payments');
  return res.data;
};

export const testRazorpayConnection = async (data) => {
  const res = await api.post('/admin/razorpay/test-connection', data);
  return res.data;
};

/* ==========================================================================
   Admin Live Conversations, Dual Reply & Project Requests CMS
   ========================================================================== */
export const getAdminConversations = async () => {
  const res = await api.get('/admin/conversations');
  return res.data;
};

export const getAdminConversation = async (id) => {
  const res = await api.get(`/admin/conversations/${id}`);
  return res.data;
};

export const sendAdminConversationMessage = async (id, data) => {
  const res = await api.post(`/admin/conversations/${id}/message`, data);
  return res.data;
};

export const replyToInquiry = async (data) => {
  const res = await api.post('/admin/conversations/reply-to-inquiry', data);
  return res.data;
};

export const getAdminProjectRequests = async () => {
  const res = await api.get('/admin/client-project-requests');
  return res.data;
};

export const updateAdminProjectRequest = async (id, data) => {
  const res = await api.patch(`/admin/client-project-requests/${id}`, data);
  return res.data;
};

export const deleteAdminProjectRequest = async (id) => {
  const res = await api.delete(`/admin/client-project-requests/${id}`);
  return res.data;
};

export const approveAdminPayment = async (paymentId) => {
  const res = await api.post(`/admin/payments/${paymentId}/approve`);
  return res.data;
};

export const rejectAdminPayment = async (paymentId, reason) => {
  const res = await api.post(`/admin/payments/${paymentId}/reject`, { reason });
  return res.data;
};

export const getAdminPricingPackages = async () => {
  const res = await api.get('/admin/pricing-packages');
  return res.data;
};

export const createPricingPackage = async (data) => {
  const res = await api.post('/admin/pricing-packages', data);
  return res.data;
};

export const updatePricingPackage = async (id, data) => {
  const res = await api.put(`/admin/pricing-packages/${id}`, data);
  return res.data;
};

export const deletePricingPackage = async (id) => {
  const res = await api.delete(`/admin/pricing-packages/${id}`);
  return res.data;
};

/* ==========================================================================
   Showcase Project Templates (Client Builder Templates) API
   ========================================================================== */
export const getPublicProjectTemplates = async () => {
  const res = await api.get('/project-templates');
  return res.data;
};

export const getAdminProjectTemplates = async () => {
  const res = await api.get('/admin/project-templates');
  return res.data;
};

export const createProjectTemplate = async (data) => {
  const res = await api.post('/admin/project-templates', data);
  return res.data;
};

export const updateProjectTemplate = async (id, data) => {
  const res = await api.put(`/admin/project-templates/${id}`, data);
  return res.data;
};

export const deleteProjectTemplate = async (id) => {
  const res = await api.delete(`/admin/project-templates/${id}`);
  return res.data;
};

export default api;


