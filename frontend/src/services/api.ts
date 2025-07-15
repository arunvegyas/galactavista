// Import shared API client and types
import { apiClient } from '../shared/utils/api';
import { 
  User, 
  UserLoginRequest, 
  UserRegisterRequest, 
  Property, 
  PropertyCreateRequest, 
  PropertyUpdateRequest, 
  PropertySearchRequest, 
  PaginationResponse 
} from '../shared/types';

// Re-export the shared API client for web-specific usage
export { apiClient };

// Web-specific API service that extends the shared client
export class WebAPIService {
  // Auth methods
  static async login(credentials: UserLoginRequest) {
    return apiClient.login(credentials);
  }

  static async register(userData: UserRegisterRequest) {
    return apiClient.register(userData);
  }

  static async getProfile() {
    return apiClient.getProfile();
  }

  static async updateProfile(profileData: Partial<User>) {
    return apiClient.updateProfile(profileData);
  }

  // Property methods
  static async getProperties(params?: PropertySearchRequest) {
    return apiClient.getProperties(params);
  }

  static async getProperty(id: number) {
    return apiClient.getProperty(id);
  }

  static async createProperty(propertyData: PropertyCreateRequest) {
    return apiClient.createProperty(propertyData);
  }

  static async updateProperty(id: number, propertyData: PropertyUpdateRequest) {
    return apiClient.updateProperty(id, propertyData);
  }

  static async deleteProperty(id: number) {
    return apiClient.deleteProperty(id);
  }

  static async getPropertiesByAgent(params?: { page?: number; page_size?: number }) {
    return apiClient.getPropertiesByAgent(params);
  }

  // Health check
  static async healthCheck() {
    return apiClient.healthCheck();
  }

  // Web-specific methods can be added here
  static async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${apiClient['baseURL']}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiClient['token']}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  }
}

// Export default instance for backward compatibility
export default WebAPIService; 