import { API_BASE_URL, ENV_SETTINGS } from '@/config/env';

// Environment-aware API utility
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = ENV_SETTINGS.apiTimeout;
    
    console.log(`🌐 API Client initialized for ${ENV_SETTINGS.environment}`);
    console.log(`🔗 Base URL: ${this.baseURL}`);
  }

  // Generic fetch wrapper with environment-specific settings
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add environment info to headers for debugging
    if (ENV_SETTINGS.isDebug) {
      config.headers = {
        ...config.headers,
        'X-Environment': ENV_SETTINGS.environment,
      };
    }

    try {
      console.log(`📡 API Request to: ${url} (${ENV_SETTINGS.environment})`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (ENV_SETTINGS.isDebug) {
        console.log(`✅ API Response from ${endpoint}:`, data);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
