import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirm: string;
    student_id?: string;
    user_type?: string;
  }) => api.post('/auth/register/', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login/', credentials),
  
  getProfile: () => api.get('/auth/profile/'),
};

// Events API calls
export const eventsAPI = {
  getEvents: (status?: string) => {
    const params = status ? { status } : {};
    return api.get('/events/', { params });
  },
  
  createEvent: (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    max_participants: number;
    category: string;
  }) => api.post('/events/', eventData),
  
  updateEvent: (eventId: number, eventData: any) =>
    api.put(`/events/${eventId}/`, eventData),
  
  deleteEvent: (eventId: number) => api.delete(`/events/${eventId}/`),
  
  joinEvent: (eventId: number) => api.post(`/events/${eventId}/join/`),
  
  skipEvent: (eventId: number) => api.post(`/events/${eventId}/skip/`),
  
  getUserParticipations: () => api.get('/events/my-participations/'),
};

// Helper functions
export const setAuthTokens = (access: string, refresh: string, user: any) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export default api;
