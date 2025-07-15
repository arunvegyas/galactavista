// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Property Types
export const PROPERTY_TYPES = {
  HOUSE: 'house',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
  APARTMENT: 'apartment',
  LAND: 'land',
  COMMERCIAL: 'commercial',
} as const;

// Property Status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  PENDING: 'pending',
  RENTED: 'rented',
} as const;

// User Roles
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  ADMIN: 'admin',
} as const;

// Navigation Routes
export const ROUTES = {
  // Auth
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE: 'profile',
  
  // Properties
  PROPERTIES: 'properties',
  PROPERTY_DETAIL: 'property-detail',
  PROPERTY_CREATE: 'property-create',
  PROPERTY_EDIT: 'property-edit',
  
  // VR Experience
  VR_EXPERIENCE: 'vr-experience',
  VR_TOUR: 'vr-tour',
  
  // Dashboard
  DASHBOARD: 'dashboard',
  AGENT_DASHBOARD: 'agent-dashboard',
  
  // Settings
  SETTINGS: 'settings',
  ABOUT: 'about',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  CACHE_PROPERTIES: 'cache_properties',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROPERTY_CREATED: 'Property created successfully!',
  PROPERTY_UPDATED: 'Property updated successfully!',
  PROPERTY_DELETED: 'Property deleted successfully!',
} as const;

// UI Constants
export const UI = {
  // Colors (will be overridden by theme)
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  SUCCESS_COLOR: '#4caf50',
  WARNING_COLOR: '#ff9800',
  ERROR_COLOR: '#f44336',
  
  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  
  // Border Radius
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
  },
  
  // Font Sizes
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Cache Configuration
export const CACHE = {
  PROPERTIES_TTL: 5 * 60 * 1000, // 5 minutes
  USER_DATA_TTL: 30 * 60 * 1000, // 30 minutes
  SETTINGS_TTL: 24 * 60 * 60 * 1000, // 24 hours
} as const; 