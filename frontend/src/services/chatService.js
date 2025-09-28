import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ API Error:', error.response?.status, error.message);
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - please try again');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        
        if (error.response?.status === 429) {
          throw new Error('Too many requests - please wait a moment');
        }
        
        throw error;
      }
    );
  }

  async sendQuery(query) {
    try {
      const response = await this.api.post('/api/ask', { query });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async syncData() {
    try {
      const response = await this.api.post('/api/sync');
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await this.api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }
}

export const chatService = new ChatService();