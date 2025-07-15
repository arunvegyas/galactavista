// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
}

// Property types
export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  lot_size?: number;
  features: string[];
  images: string[];
  vr_model_url?: string;
  agent: User;
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'house' | 'condo' | 'townhouse' | 'apartment' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'sold' | 'pending' | 'rented';

export interface PropertyCreateRequest {
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  property_type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  lot_size?: number;
  features?: string[];
  images?: string[];
}

export interface PropertyUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  property_type?: PropertyType;
  status?: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  lot_size?: number;
  features?: string[];
  images?: string[];
  vr_model_url?: string;
}

// Search and pagination types
export interface PaginationRequest {
  page?: number;
  page_size?: number;
}

export interface PropertySearchRequest extends PaginationRequest {
  query?: string;
  min_price?: number;
  max_price?: number;
  property_type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
  status?: PropertyStatus;
}

export interface PaginationResponse<T> {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: T[];
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// VR Experience types
export interface VRExperience {
  id: number;
  property_id: number;
  property: Property;
  model_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VRExperienceCreateRequest {
  property_id: number;
  model_url: string;
  thumbnail_url?: string;
}

// Dashboard types
export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  totalViews: number;
  totalInquiries: number;
}

export interface AgentDashboardData {
  stats: DashboardStats;
  recentProperties: Property[];
  recentInquiries: any[]; // TODO: Define inquiry type
}

// Mobile-specific types
export interface MobileNavigationProps {
  navigation: any;
  route: any;
}

export interface ScreenProps {
  navigation: any;
  route: any;
} 