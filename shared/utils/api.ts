import { APIResponse, LoginResponse, User, UserLoginRequest, UserRegisterRequest, Property, PropertyCreateRequest, PropertyUpdateRequest, PropertySearchRequest, PaginationResponse } from '../types';

// API base URL - can be configured per platform
export const getAPIBaseURL = () => {
  // For development, use localhost
  // In production, this would be your actual API domain
  // This will be overridden by environment variables in each platform
  return 'http://localhost:8080/api/v1';
};

// Generic API client for both web and mobile
export class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || getAPIBaseURL();
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.clearToken();
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: UserLoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
    }
    
    return response.data!;
  }

  async register(userData: UserRegisterRequest): Promise<User> {
    const response = await this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>('/auth/profile');
    return response.data!;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data!;
  }

  // Property methods
  async getProperties(params?: PropertySearchRequest): Promise<PaginationResponse<Property>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await this.request<PaginationResponse<Property>>(
      `/properties?${queryParams.toString()}`
    );
    return response.data!;
  }

  async getProperty(id: number): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`);
    return response.data!;
  }

  async createProperty(propertyData: PropertyCreateRequest): Promise<Property> {
    const response = await this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
    return response.data!;
  }

  async updateProperty(id: number, propertyData: PropertyUpdateRequest): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
    return response.data!;
  }

  async deleteProperty(id: number): Promise<void> {
    await this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getPropertiesByAgent(params?: { page?: number; page_size?: number }): Promise<PaginationResponse<Property>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await this.request<PaginationResponse<Property>>(
      `/properties/agent?${queryParams.toString()}`
    );
    return response.data!;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.request<{ status: string }>('/health');
    return response.data!;
  }
}

// Create a singleton instance
export const apiClient = new APIClient(); 